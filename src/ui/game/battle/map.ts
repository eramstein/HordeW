import { FullState } from "../../model";
import { TerrainType, Unit, LogType, LogResult, Log, BattleStage } from "../../../engine/battle/model";
import { updateTile, getDistance } from "../../../engine/battle/board";
import { getReachablePositions, canUnitMove, getAttackableUnits } from "../../../engine/battle/unit";
import { sendAction, ActionType } from "./actions";
import { deployUnit } from "../../../engine/battle/deployment";
import { TOOL_TILE_VALUES } from "./config";
import { preProcessTiles } from "../../../engine/battle/ai/preProcessTiles";

export const PADDING = 20;
export const TILE_HEIGHT = 75;
export const TILE_WIDTH = Math.sqrt(3)/2 * TILE_HEIGHT;

export interface ActionLabel {
    color: string,
    text: string,
    unit: Unit,
    done: boolean,
    isPlayer: boolean,
}

export function onClickTile(state : FullState, x, y) {
    // TERRAIN EDIT
    if (state.ui.tools.terrainEditor && state.ui.tools.terrainType) {
        const oldTile = state.game.battle.tiles[x][y];
        updateTile(state.game, x, y, { ...oldTile, terrain: TerrainType[state.ui.tools.terrainType] });
    }
    // UNIT DEPLOYMENT
    if (state.game.battle.stage === BattleStage.Deployment && state.ui.selected.benchUnit) {
        deployUnit(state.game, state.ui.selected.benchUnit, { x, y });
    }
    state.ui.tooltip = null;
}

export function onClickRightTile(state : FullState, x, y) {
    const selectedUnit = state.ui.selected.unit;
    // UNIT MOVE
    if (selectedUnit &&
        selectedUnit.owner === 0 &&
        canUnitMove(state.game, selectedUnit)
    ) {
        sendAction(state.game, ActionType.Move, { 
            unit: selectedUnit, 
            pos: { x, y },
        });
        unselect(state);
    }
    state.ui.tooltip = null;
}

export function getTilePixelPos(x, y : number) : { tx: number, ty : number} {
    let tx = (x + Math.ceil(y%2)/2) * TILE_WIDTH + PADDING;
    let ty = y * (TILE_HEIGHT * 0.75) + PADDING;
    return { tx, ty,};
}

export function onClickUnit(state : FullState, clickedUnit : Unit) {
    const isUnit = state.ui.selected.unit && state.ui.selected.unit.id === clickedUnit.id;
    unselect(state);

    if (!isUnit) {
        state.ui.selected.unit = clickedUnit;
        // HIGHLIGHT REACHABLE TILES
        const reachableTiles = getReachablePositions(state.game, clickedUnit);        
        reachableTiles.forEach(t => {
            state.ui.highlighted.tiles[t.x + "." + t.y] = true;
        });
        // HIGHLIGHT ATTACKABLE UNITS
        const attackableUnits = getAttackableUnits(state.game, clickedUnit);        
        attackableUnits.forEach(u => {
            const distance = getDistance(clickedUnit.position, u.position);
            if (distance === 1) {
                state.ui.highlighted.meleeAttackableUnits[u.id] = true;
            } else {
                state.ui.highlighted.rangeAttackableUnits[u.id] = true;
            }            
        });
    }

    // TOOLS : AI TILE VALUES
    if (TOOL_TILE_VALUES && clickedUnit.owner !== 0) {
        const tiles = preProcessTiles(state.game, clickedUnit);
        console.log('preProcessTiles', tiles);
        state.ui.tools.aiTileValues = tiles;
    }
}

export function onClickRightUnit(state : FullState, clickedUnit : Unit) {
    const selectedUnit = state.ui.selected.unit;
    const selectedAbility = state.ui.selected.ability;
    
    // ABILITY USE
    if (selectedAbility && selectedAbility.target) {
        if (state.ui.selected.abilityTargettedUnits[clickedUnit.id]) {
            delete state.ui.selected.abilityTargettedUnits[clickedUnit.id];
        } else {
            state.ui.selected.abilityTargettedUnits[clickedUnit.id] = true;        
            if (Object.keys(state.ui.selected.abilityTargettedUnits).length === selectedAbility.target.count) {
                const targetUnits = state.game.battle.units.filter(u => state.ui.selected.abilityTargettedUnits[u.id]);
                sendAction(state.game, ActionType.Ability, { 
                    unit: selectedUnit,
                    ability: selectedAbility,
                    targetUnits: targetUnits,
                    targetPositions: state.ui.selected.abilityTargettedPositions,
                });
                unselect(state);                
            }
        }        
        return;
    }

    // UNIT ATTACK
    if (selectedUnit && selectedUnit.owner === 0) {
        sendAction(state.game, ActionType.Attack, { 
            attacker: selectedUnit, 
            defender: clickedUnit,
        });
        unselect(state);
        return;   
    }

}

export function unselect(state : FullState) {    
    state.ui.selected.unit = null;
    state.ui.highlighted.tiles = {};
    state.ui.highlighted.meleeAttackableUnits = {};
    state.ui.highlighted.rangeAttackableUnits = {};
    state.ui.highlighted.abilityTargettableUnits = {};
    state.ui.selected.abilityTargettedUnits = {};
    state.ui.selected.ability = null;
    state.ui.tooltip = null;
}

export function getActionLabels(logs : Log[]) : ActionLabel[] {
    const labels : ActionLabel[] = [];    
    logs.forEach(log => {
        if (log.type === LogType.Attack) {
            labels.push({
                unit: log.entity,
                color: 'black',
                text: 'WHAAAG',
                done: false,
                isPlayer: log.currentFaction === 0,
            });
            if (log.result === LogResult.Miss) {
                labels.push({
                    unit: log.target,
                    color: 'green',
                    text: 'MISS',
                    done: false,
                    isPlayer: log.currentFaction === 0,
                });
            }
        }
        if (log.type === LogType.Damage) {
            labels.push({
                unit: log.entity,
                color: 'red',
                text: log.data.damage,
                done: false,
                isPlayer: log.currentFaction === 0,
            });
        }
        if (log.type === LogType.Ability) {
            labels.push({
                unit: log.entity,
                color: 'black',
                text: log.data.name,
                done: false,
                isPlayer: log.currentFaction === 0,
            });
        }
        if (log.type === LogType.Pass && log.currentFaction !== 0) {
            labels.push({
                unit: log.entity,
                color: 'black',
                text: 'PASS',
                done: false,
                isPlayer: false,
            });
        }
    });    

    return labels;
}

export function isUnitActive(unit : Unit, logs : Log[]) : boolean {
    if (unit.owner === 0) {
        return false;
    }

    let active = false;

    logs.filter(log => log.entity.id === unit.id)
        .forEach(log => {
            if (log.currentFaction === unit.owner) {
                active = true;
            }
        });    

    return active;
}