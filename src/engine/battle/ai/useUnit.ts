import { GameState } from "../../game";
import { Unit, Pos, Tile } from "../model";
import { passUnitTurn, getReachablePositions, canUnitAttack, getVisibleEnemiesInRange, canUnitOpportunityAttack, canUnitMove } from "../unit";
import { moveUnit } from "../movement";
import { pickFrom } from "../../../utils/random";
import { attack } from "../combat";
import { preProcessTiles } from "./preProcessTiles";
import { getDistance, TERRAIN_SPECS } from "../board";
import { AiTileValue } from "./model";
import { getNextStepTowards, MAX_UNIT_VAL, getAttackValue } from "./utils";
import { UNIT_PREFS } from "./config";

/*
Default behaviour:

> Can I attack ?
    Y -> attack highest value target
    N -> Is there an enemy that can opportunity attack me ?
        Y -> pass
        N -> Is there a reachable tile with better value ?
            Y -> Move to highest reachable tile
            N -> Is there any tile with better value ?
                Y -> Move towards highest tile
                N -> pass
    After move, check if now attack is possible

TODO
Special cases:
- zerk : ignore opportunity attacks if there is a juicer target elsewhere
- raider : will move towards wincon if none is in range, unless opp attack
- killer : will move towards best bounty in range before attacking
- support: based on their abilities, TBD
*/

export function useUnitGeneral(gs : GameState, unit : Unit) {
    let enemiesInRange;
    
    if (canUnitAttack(gs, unit)) {
        enemiesInRange = getVisibleEnemiesInRange(gs, unit);
        if (enemiesInRange.length > 0) {
            doAttack(gs, unit, enemiesInRange);
            return;
        }
    }

    const enemiesThatCanOpportunityAttack = gs.battle.units.filter(u => {
        return u.owner !== unit.owner &&
            canUnitOpportunityAttack(gs, u) &&
            getDistance(u.position, unit.position) === 1;
    });

    if (enemiesThatCanOpportunityAttack.length > 0) {
        passUnitTurn(gs, unit);
        return;
    }

    if (canUnitMove(gs, unit)) {
        doMove(gs, unit);
    }
    
    if (canUnitAttack(gs, unit)) {
        enemiesInRange = getVisibleEnemiesInRange(gs, unit);
        if (enemiesInRange.length > 0) {
            doAttack(gs, unit, enemiesInRange);
            return;
        }        
    }

    passUnitTurn(gs, unit);
    return;

}

// bounty - totalThreat * MAX_UNIT_VAL * perso.survival
function getTileValue(gs : GameState, unit : Unit, tileAiValue : AiTileValue) : number {    
    return tileAiValue.bounty - tileAiValue.threatTotal * MAX_UNIT_VAL * UNIT_PREFS[unit.ai.perso].survival;
}

function moveTo(gs : GameState, unit : Unit, destination : Pos) {
    moveUnit(gs, unit, destination);
}

function doAttack(gs : GameState, unit : Unit, possibleTargets : Unit[]) {
    let bestUnitValue = -Infinity;
    let bestUnitIndex = 0;
    possibleTargets.forEach((u, i) => {
        const distance = getDistance(unit.position, u.position);
        const rangeAttackPosition = distance === 1 ? null : unit.position;
        const value = getAttackValue(gs, unit, u, rangeAttackPosition);
        if (value > bestUnitValue) {
            bestUnitValue = value;
            bestUnitIndex = i;
        }
    });
    attack(gs, unit, possibleTargets[bestUnitIndex], false);
}

function doMove(gs : GameState, unit : Unit) : boolean {
    let didMove = false;
    const tileValues = preProcessTiles(gs, unit);
    let bestReachableTileValue = -Infinity;
    let bestReachableTile : Pos;
    let bestOverallTileValue = -Infinity;
    let bestOverallTile : Pos;
    const currentTileValue = getTileValue(gs, unit, tileValues[unit.position.x][unit.position.y]);
    const reachablePositions = getReachablePositions(gs, unit);
    const reachableTilesMap = reachablePositions.reduce((agg, pos) => {
        agg[pos.x + "." + pos.y] = true;
        return agg;
    }, {});
    const occupied = gs.battle.units.reduce((acc, unit) => {
        acc[unit.position.x + "." + unit.position.y] = true;
        return acc;
    }, {});
    for (let x = 0; x < tileValues.length; x++) {
        for (let y = 0; y < tileValues[x].length; y++) {
            const tile = gs.battle.tiles[x][y];
            if (!TERRAIN_SPECS[tile.terrain].blocksMovement && !occupied[x + "." + y]) {            
                const value = getTileValue(gs, unit, tileValues[x][y]);
                if (value > bestOverallTileValue) {
                    bestOverallTileValue = value;
                    bestOverallTile = { x, y };
                }
                if (reachableTilesMap[x + "." + y] && value > bestReachableTileValue) {
                    bestReachableTileValue = value;
                    bestReachableTile = { x, y };
                }
            }
        }
    }
    
    if (bestReachableTileValue > currentTileValue) {
        console.log('MOVE TO BEST REACHABLE: ', bestReachableTile, unit);
        moveTo(gs, unit, bestReachableTile);
        didMove = true;
    }

    if (!didMove && bestOverallTileValue > currentTileValue) {
        console.log('MOVE TO BEST OVERALL: ', bestOverallTile, unit);
        const target = getNextStepTowards(gs, unit, reachableTilesMap, bestOverallTile);
        console.log('    TARGET: ', target);        
        moveTo(gs, unit, target);
        didMove = true;
    }

    return didMove;
}