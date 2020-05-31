import { FullState } from "../../model";
import { TerrainType, Unit, LogType, LogResult, Log } from "../../../engine/battle/model";
import { updateTile, getDistance } from "../../../engine/battle/board";
import { getReachablePositions, canUnitMove, getAttackableUnits } from "../../../engine/battle/unit";
import { sendAction, ActionType } from "./actions";

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
}

export function getTilePixelPos(x, y : number) : { tx: number, ty : number} {
    let tx = (x + Math.ceil(y%2)/2) * TILE_WIDTH + PADDING;
    let ty = y * (TILE_HEIGHT * 0.75) + PADDING;
    return { tx, ty,};
}

export function onClickUnit(state : FullState, clickedUnit : Unit) {
    const isUnit = state.ui.selected.unit && state.ui.selected.unit.id === clickedUnit.id;
    unselect(state);
    if (isUnit) {
        state.ui.selected.unit = null;        
    } else {
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
}

export function onClickRightUnit(state : FullState, clickedUnit : Unit) {
    const selectedUnit = state.ui.selected.unit;
    
    // UNIT ATTACK
    if (selectedUnit && selectedUnit.owner === 0) {
        sendAction(state.game, ActionType.Attack, { 
            attacker: selectedUnit, 
            defender: clickedUnit,
        });
        unselect(state);        
    }
}

export function unselect(state : FullState) {    
    state.ui.selected.unit = null;
    state.ui.highlighted.tiles = {};
    state.ui.highlighted.meleeAttackableUnits = {};
    state.ui.highlighted.rangeAttackableUnits = {};
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
            labels.push({
                unit: log.target,
                color: log.result === LogResult.Hit ? 'red' : 'green',
                text: log.result === LogResult.Hit ? log.data.damage : 'MISS',
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