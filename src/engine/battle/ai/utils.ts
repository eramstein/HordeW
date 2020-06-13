import { GameState } from "../../game";
import { Unit, Pos } from "../model";
import { getDistance } from "../board";
import { getHitChance, getRangeSkillDiff, getRangeSkillDiffFromPos, getMeleeSkillDiff } from "../combat";
import { UNIT_PREFS } from "./config";

export const MAX_UNIT_VAL = 100;

export function getClosestEnemyLoseCondition(gs : GameState, unit : Unit) : Unit {
    const loseCons = gs.battle.units.filter(u => u.loseCondition && u.owner !== unit.owner);
    if (loseCons.length === 0) {
        return null;
    }
    const sorted = loseCons.sort((a, b) => {
        return getDistance(unit.position, a.position) - getDistance(unit.position, b.position);
    });    
    return sorted[0];
}

export function getClosestEnemySurviveCondition(gs : GameState, unit : Unit) : Unit {
    const loseCons = gs.battle.units.filter(u => u.surviveCondition && u.owner !== unit.owner);
    if (loseCons.length === 0) {
        return null;
    }
    const sorted = loseCons.sort((a, b) => {
        return getDistance(unit.position, a.position) - getDistance(unit.position, b.position);
    });    
    return sorted[0];
}

// what is the closest position from target among the possible ones?
export function getNextStepTowards(gs : GameState, reachablePositions : Pos[], targetPosition : Pos) : Pos {    
    // dumb version: just consider distance
    let closestDistance = Infinity;
    let closestPos;    
    reachablePositions.forEach(pos => {      
        const dist = getDistance(pos, targetPosition);
        if (dist < closestDistance) {
            closestPos = pos;
            closestDistance = dist;
        }
    });
    return closestPos;
}

export function damageExpectationMelee(gs : GameState, attacker : Unit, defender : Unit) : number {
    const avgDamage = (attacker.meleeDamage.max + attacker.meleeDamage.min) / 2;
    const hitChance = getHitChance(getMeleeSkillDiff(attacker, defender));    
    return hitChance * avgDamage;
}

export function damageExpectationRange(gs : GameState, attacker : Unit, defender : Unit, attackerPos : Pos, defenderPos : Pos) : number {
    if (!attacker.rangeDamage) {
        return 0;
    }
    const avgDamage = (attacker.rangeDamage.max + attacker.rangeDamage.min) / 2;
    const hitChance = getHitChance(getRangeSkillDiffFromPos(attacker, defender, attackerPos, defenderPos));
    return hitChance * avgDamage;
}

export function getAttackValue(gs : GameState, attacker : Unit, defender : Unit, rangeAttackFrom : Pos) : number {
    if (defender.owner === attacker.owner) {
        return 0;
    }
    // value of unit * expected damage
    let unitValue = getUnitValue(gs, attacker, defender);
    let expectedDamage = rangeAttackFrom ?
        damageExpectationRange(gs, attacker, defender, rangeAttackFrom, defender.position) :
        damageExpectationMelee(gs, attacker, defender);
    return unitValue * Math.min(expectedDamage / defender.hp, 1);
}

/* value of killing this unit relatively to other enemies
   normalized (kind of, based on constant max val to be re-evaluated later) 0 to 1
*/
export function getUnitValue(gs : GameState, attacker : Unit, unit : Unit) : number {
    if (unit.aiValue) {
        return unit.aiValue;
    }   

    let val = 0;
    let meleeAttackVal = unit.meleeAttack * (unit.meleeDamage.max + unit.meleeDamage.min) / 2;
    let rangeAttackVal = unit.range ? (unit.range / 3) * (unit.rangeDamage.max + unit.rangeDamage.min) / 2 : 0;
    
    val += unit.hpMax / 2;
    val += unit.movement * 5;
    val += Math.max(meleeAttackVal, rangeAttackVal) + Math.sqrt(Math.min(meleeAttackVal, rangeAttackVal));

    if (unit.loseCondition) {
        val += MAX_UNIT_VAL * UNIT_PREFS[attacker.ai.perso].wincon;
    } else if (unit.surviveCondition) {
        val += MAX_UNIT_VAL * 0.9 * UNIT_PREFS[attacker.ai.perso].wincon;
    } else {
        val = val * UNIT_PREFS[attacker.ai.perso].kill;
    }

    return Math.min(val/MAX_UNIT_VAL, 1);
}