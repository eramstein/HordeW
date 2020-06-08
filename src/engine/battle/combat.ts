/*
Goals:
- computable by humans (small numbers)
- some randomness (compensated by monk/witch ?)
- usual time to kill 2/4 hits

Usual ranges:
ATK, DEF : 1-5
RANGE ATK: 1-5
RANGE DEF : 0-2 (distance will compensate)
RANGE: 1-3 (archers), 4-9 (artillery)
ARMOR: 0-3
HP: 5-20
DAMAGE: 1-8
MORALE: 5-12

Melee
1. hit chance: ATK - DEF
    +3 -> 100%
    +2 -> 90% -> +1 monk point if miss
    +1 -> 66%
     0 -> 50%
    -1 -> 33%
    -2 -> 10% -> +1 witch point if hit
    -3 -> 0%

    if miss, -1 DEF until EOT
    or: morale penalty?

2. damage: damage roll - armor
    if armor absorbs all, 20% chance to lose 1 armor    

Range
1. hit chance: ATK - DEF - distance
2. damage: same

Morale effects: TBD

Disengage while in melee: TBD

Flanking effects: TBD

*/

import { GameState } from "../game";
import { Unit, LogType, LogResult, Pos } from "./model";
import { canUnitAttack, damageUnit, checkIfUnitExhausted, getAttackableUnits } from "./unit";
import { getDistance } from "./board";
import { getRandomInt } from "../../utils/random";
import { nextTurn } from "./turn";
import { addLog } from "./log";

export function isValidAttackTarget(gs : GameState, attacker : Unit, target : Unit) : boolean {

    if (!canUnitAttack(gs, attacker)) {
        return false;
    }

    const validTargets = getAttackableUnits(gs, attacker).reduce((acc, u) => {
        acc[u.id] = true;
        return acc;
    }, {});    

    if (!validTargets[target.id]) {
        return false;
    }
    
    return true;
}

export function attack(gs : GameState, attacker : Unit, defender : Unit, free : boolean) {    
    if (!free && !isValidAttackTarget(gs, attacker, defender)) {
        console.log("invalid target");        
        return false;
    }

    addLog(gs, {
        type: LogType.Attack,
        entity: { ...attacker },
        target: { ...defender },
        text: `${attacker.name} attacks ${defender.name}`,
    });
    
    const isRange = !!(getDistance(attacker.position, defender.position) > 1);
    
    if (isRange) {
        rangeAttack(gs, attacker, defender);
    } else {
        meleeAttack(gs, attacker, defender);
    }    

    if (!free) {
        attacker.attacksCount++;
        checkIfUnitExhausted(gs, attacker);
        nextTurn(gs);
    }
}

function meleeAttack(gs : GameState, attacker : Unit, defender : Unit) {    
    // hit or miss
    const skillDiff = getMeleeSkillDiff(gs, attacker, defender);
    const hits = checkIfHit(gs, attacker, defender, skillDiff);

    // damage
    if (hits) {
        inflictDamage(gs, attacker, defender, attacker.meleeDamage.min, attacker.meleeDamage.max);
    }    
}

function rangeAttack(gs : GameState, attacker : Unit, defender : Unit) {        
    // hit or miss
    const skillDiff = getRangeSkillDiff(attacker, defender);
    const hits = checkIfHit(gs, attacker, defender, skillDiff);

    // damage
    if (hits) {
        inflictDamage(gs, attacker, defender, attacker.rangeDamage.min, attacker.rangeDamage.max);
    }
}

function inflictDamage(gs : GameState, attacker : Unit, defender : Unit, min, max : number) {
    let damage = getRandomInt(min, max);
    damage = Math.max(0, damage - defender.armor);
    damageUnit(gs, defender, damage);
}

function checkIfHit(gs : GameState, attacker : Unit, defender : Unit, skillDiff : number) : boolean {
    let hitChance = getHitChance(skillDiff);
    const hitRoll = Math.random();

    if (hitRoll > hitChance) {
        addLog(gs, {
            type: LogType.Attack,
            entity: { ...attacker },
            target: { ...defender },
            result: LogResult.Miss,
            text: `${attacker.name} misses ${defender.name}`,
        });
        return false;
    }

    return true;
}

export function getHitChance(skillDiff : number) : number {
    let hitChance = 0;
    if (skillDiff <= -3) {
        hitChance = 0;
    } else if(skillDiff === -2) {
        hitChance = 0.1;
    } else if(skillDiff === -1) {
        hitChance = 0.333;
    } else if(skillDiff === 0) {
        hitChance = 0.5;
    } else if(skillDiff === 1) {
        hitChance = 0.666;
    } else if(skillDiff === 2) {
        hitChance = 0.9;
    } else if(skillDiff > 2) {
        hitChance = 1;
    }
    return hitChance;
}

export function getMeleeSkillDiff(gs : GameState, attacker : Unit, defender : Unit) : number {
    return attacker.meleeAttack - defender.meleeDefense;
}

export function getRangeSkillDiff(attacker : Unit, defender : Unit) : number {
    return getRangeSkillDiffFromPos(attacker, defender, attacker.position, defender.position);
}

export function getRangeSkillDiffFromPos(attacker : Unit, defender : Unit, attackerPos : Pos, defenderPos : Pos) : number {
    return attacker.rangeAttack - defender.rangeDefense - getDistance(attackerPos, defenderPos);
}