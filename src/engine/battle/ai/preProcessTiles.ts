import { GameState } from "../../game";
import { Unit, UnitAiPerso, Pos } from "../model";
import { MAP_SIZE, getAdjacentPositions, getPositionsInRange, getPositionsInRangeRange, getDistance } from "../board";
import { UNIT_PREFS } from "./config";
import { canUnitAttack, canUnitMove, getVisiblePositions, canSeeUnit } from "../unit";
import { damageExpectationMelee, damageExpectationRange, getAttackValue } from "./utils";
import { AiTileValue } from "./model";

/*
For a given AI unit, assign a value to each tile, based on how much it wants to be on this tile
Can be negative

1: assign to each enemy units:
    - threat level (by distance)
    - attack value value (by distance)
   and to each allied unit
    - protection level that ally provides
    - help level that ally needs
2: assign to tiles (apply unit's PREF coeficients):
    - total threat of nearby units -> negative value
    - highest attack value of nearby units -> positive value
    - total protection provided by nearby units -> positive value
    - total help needed by nearby units -> positive value
*/

export function preProcessTiles(gs : GameState, myUnit : Unit) : AiTileValue[][] {        
    const tileValues : AiTileValue[][] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
        tileValues[x] = [];
        for (let y = 0; y < MAP_SIZE; y++) {
            tileValues[x][y] = { threatTotal: 0, threatMax: 0, bounty: 0 };        
        }   
    }
    
    gs.battle.units.forEach(otherUnit => {

        let adjacentTiles;
        // threat        
        if (otherUnit.owner !== myUnit.owner && canUnitAttack(gs, otherUnit)) {
            adjacentTiles = getAdjacentPositions(otherUnit.position);
            adjacentTiles.forEach(pos => {     
                const dmg = damageExpectationMelee(gs, myUnit, otherUnit);
                tileValues[pos.x][pos.y].threatTotal += dmg;
                tileValues[pos.x][pos.y].threatMax = Math.max(
                    tileValues[pos.x][pos.y].threatMax,
                    dmg,
                );
            });
            if (otherUnit.range) {
                const tilesInShootingRange = getPositionsInRangeRange(otherUnit.position, otherUnit.range, 2);
                tilesInShootingRange.forEach(pos => {
                    if (canSeeUnit(gs, otherUnit, pos)) {
                        const dmg = damageExpectationRange(gs, otherUnit, myUnit, otherUnit.position, pos);
                        tileValues[pos.x][pos.y].threatTotal += dmg;
                        tileValues[pos.x][pos.y].threatMax = Math.max(
                            tileValues[pos.x][pos.y].threatMax,
                            dmg,
                        );
                    }                    
                });
            }
        }

        // bounty
        if (otherUnit.owner !== myUnit.owner) {
            if (!adjacentTiles) {
                adjacentTiles = getAdjacentPositions(otherUnit.position);
            }
            adjacentTiles.forEach(pos => {          
                tileValues[pos.x][pos.y].bounty = Math.max(
                    tileValues[pos.x][pos.y].bounty,
                    getAttackValue(gs, myUnit, otherUnit, null),
                );
            });
            if (myUnit.range) {
                const tilesInRange = getPositionsInRangeRange(otherUnit.position, myUnit.range, 2);                
                tilesInRange.forEach(pos => {
                    if (canSeeUnit(gs, { ...myUnit, position: pos }, otherUnit.position)) {
                        tileValues[pos.x][pos.y].bounty = Math.max(
                            tileValues[pos.x][pos.y].bounty,
                            getAttackValue(gs, myUnit, otherUnit, pos) * stillInRangeProba(gs, pos, myUnit.range, otherUnit),
                        );
                    }
                });
            }
        }
        
    });
    
    return tileValues;
}

function stillInRangeProba(gs : GameState, pos : Pos, range : number, unit : Unit) : number {
    return canUnitMove(gs, unit) ? 0.5 : 1;
}