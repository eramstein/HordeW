import { GameState } from "../../game";
import { Unit, UnitAiPerso, Pos } from "../model";
import { MAP_SIZE, getAdjacentPositions, getPositionsInRange, getPositionsInRangeRange, getDistance } from "../board";
import { UNIT_PREFS } from "./config";
import { canUnitAttack, canUnitMove } from "../unit";
import { damageExpectationMelee, damageExpectationRange } from "./utils";

/*
For a given AI unit, assign a value to each tile, based on how much it wants to be on this tile
Can be negative

1: assign to each enemy units:
    - threat level (by distance)
    - bounty value
   and to each allied unit
    - protection level that ally provides
    - help level that ally needs
2: assign to tiles (apply unit's PREF coeficients):
    - total threat of nearby units -> negative value
    - total bounty of nearby units -> positive value
    - total protection provided by nearby units -> positive value
    - total help needed by nearby units -> positive value
*/

interface UnitTags {
    threatMelee: number;
    threatRange: number;
    bounty: number;
    protection: number;
    help: number;
}

export function preProcessTiles(gs : GameState, myUnit : Unit) : number[][] {
    const tileValues : number[][] = new Array(MAP_SIZE)
        .fill(0)
        .map(v => new Array(MAP_SIZE)
        .fill(0));
    const tileMaxBounties : number[][] = new Array(MAP_SIZE)
        .fill(0)
        .map(v => new Array(MAP_SIZE)
        .fill(0));
    
    gs.battle.units.forEach(otherUnit => {
        const tags : UnitTags = {
            threatMelee: getUnitThreatMeleeLevel(gs, myUnit, otherUnit),
            threatRange: getUnitThreatRangeLevel(gs, myUnit, otherUnit),
            bounty: getUnitBountyLevel(gs, myUnit, otherUnit),
            protection: 0,
            help: 0,
        }

        let adjacentTiles;
        // threat        
        if (otherUnit.owner !== myUnit.owner && canUnitAttack(gs, otherUnit)) {
            const adjacentTiles = getAdjacentPositions(otherUnit.position);
            adjacentTiles.forEach(pos => {         
                tileValues[pos.x][pos.y] -= tags.threatMelee;
            });
            if (otherUnit.range) {
                const tilesInShootingRange = getPositionsInRangeRange(otherUnit.position, otherUnit.range, 2);
                tilesInShootingRange.forEach(pos => {
                    tileValues[pos.x][pos.y] -= tags.threatRange;
                });
            }
        }

        // bounty
        if (otherUnit.owner !== myUnit.owner) {
            if (!adjacentTiles) {
                adjacentTiles = getAdjacentPositions(otherUnit.position);
            }
            adjacentTiles.forEach(pos => {         
                tileMaxBounties[pos.x][pos.y] = Math.max(
                    tileMaxBounties[pos.x][pos.y],
                    tags.bounty * meleePref(myUnit),
                );
            });
            if (myUnit.range) {
                const tilesInRange = getPositionsInRangeRange(otherUnit.position, myUnit.range, 2);        
                tilesInRange.forEach(pos => {
                    tileMaxBounties[pos.x][pos.y] = Math.max(
                        tileMaxBounties[pos.x][pos.y],
                        tags.bounty * stillInRangeProba(gs, pos, myUnit.range, otherUnit),
                    );
                });
            }            
        }        
        
    });    
    
    // add bounties to threats
    for (let x = 0; x < MAP_SIZE; x++) {
        for (let y = 0; y < MAP_SIZE; y++) {            
            tileValues[x][y] += tileMaxBounties[x][y];          
        }        
    }
    
    return tileValues;
}

function getUnitThreatMeleeLevel(gs : GameState, myUnit : Unit, otherUnit : Unit) : number {
    const threat = damageExpectationMelee(gs, otherUnit, myUnit) / myUnit.hp;
    return threat * UNIT_PREFS[myUnit.ai.perso].survival;
}

function getUnitThreatRangeLevel(gs : GameState, myUnit : Unit, otherUnit : Unit) : number {
    if (!otherUnit.range) {
        return 0;
    }
    const threat = damageExpectationRange(gs, otherUnit, myUnit) / myUnit.hp;
    return threat * UNIT_PREFS[myUnit.ai.perso].survival;
}

function getUnitBountyLevel(gs : GameState, myUnit : Unit, otherUnit : Unit) : number {
    if (otherUnit.owner === myUnit.owner) {
        return 0;
    }
    // value of unit / difficulty of killing it
    let unitValue = getUnitValue(gs, myUnit, otherUnit);
    const killDifficulty = getKillDifficulty(gs, myUnit, otherUnit);
    return unitValue / killDifficulty;
}

/* value of killing this unit relatively to other enemies
   normalized (kind of, based on constant max val to be re-evaluated later) 0 to 1
*/
function getUnitValue(gs : GameState, myUnit : Unit, unit : Unit) : number {
    if (unit.aiValue) {
        return unit.aiValue;
    }
    const MAX_VAL = 100;

    let val = 0;
    let meleeAttackVal = unit.meleeAttack * (unit.meleeDamage.max + unit.meleeDamage.min) / 2;
    let rangeAttackVal = unit.range ? (unit.range / 3) * (unit.rangeDamage.max + unit.rangeDamage.min) / 2 : 0;
    
    val += unit.hpMax / 2;
    val += unit.movement * 5;
    val += Math.max(meleeAttackVal, rangeAttackVal) + Math.sqrt(Math.min(meleeAttackVal, rangeAttackVal));

    if (unit.loseCondition) {
        val += MAX_VAL * UNIT_PREFS[myUnit.ai.perso].wincon;
    } else if (unit.surviveCondition) {
        val += MAX_VAL * 0.9 * UNIT_PREFS[myUnit.ai.perso].wincon;
    } else {
        val = val * UNIT_PREFS[myUnit.ai.perso].kill;
    }

    return Math.min(val/MAX_VAL, 1);
}

/* chances of killing this unit relatively to other enemies
   normalized (kind of, based on constant max val to be re-evaluated later) 0 to 1
*/
function getKillDifficulty(gs : GameState, myUnit : Unit, otherUnit : Unit) : number {
    const MAX_VAL = 50;
    // for now we don't use myUnit, can be used later for stuff like armor piercing    
    const val = otherUnit.hp + otherUnit.armor * 5;
    return Math.min(val/MAX_VAL, 1);
}

function stillInRangeProba(gs : GameState, pos : Pos, range : number, unit : Unit) : number {
    return canUnitMove(gs, unit) ? 0.5 : 1;
}

function meleePref(unit : Unit) : number {
    return unit.range ? 0.5 : 1;
}