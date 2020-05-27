import { FullState } from "../../model";
import { TerrainType } from "../../../engine/battle/model";
import { updateTile, getDistance } from "../../../engine/battle/board";
import { getReachablePositions, canUnitMove, canUnitAttack } from "../../../engine/battle/unit";
import { sendAction, ActionType } from "./actions";
import { isValidAttackTarget } from "../../../engine/battle/combat";

export const PADDING = 20;
export const TILE_HEIGHT = 75;
export const TILE_WIDTH = Math.sqrt(3)/2 * TILE_HEIGHT;

export function onClickTile(state : FullState, x, y) {
    // TERRAIN EDIT
    if (state.ui.tools.terrainEditor && state.ui.tools.terrainType) {
        const oldTile = state.game.battle.tiles[x][y];
        updateTile(state.game, x, y, { ...oldTile, terrain: TerrainType[state.ui.tools.terrainType] });
    } 
}

export function onClickRightTile(state : FullState, x, y) {
    // UNIT MOVE
    if (state.ui.selected.unit !== null &&
        state.ui.selected.unit !== undefined &&
        canUnitMove(state.game, state.game.battle.units[state.ui.selected.unit])
    ) {
        sendAction(state.game, ActionType.Move, { 
            unit: state.game.battle.units[state.ui.selected.unit], 
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

export function onClickUnit(state : FullState, unitIndex : number) {
    state.ui.highlighted.tiles = {};
    if (state.ui.selected.unit !== null && state.ui.selected.unit === unitIndex) {
        state.ui.selected.unit = null;
    } else {
        state.ui.selected.unit = unitIndex;
        const unit = state.game.battle.units[unitIndex];
        if (canUnitMove(state.game, unit)) {
            const reachableTiles = getReachablePositions(state.game, state.game.battle.units[unitIndex]);        
            reachableTiles.forEach(t => {
                state.ui.highlighted.tiles[t.x + "." + t.y] = true;
            });
        }                
    }    
}

export function onClickRightUnit(state : FullState, unitIndex : number) {
    const units = state.game.battle.units;
    const selectedUnit = units[state.ui.selected.unit];
    const clickedUnit = units[unitIndex];
    
    // UNIT ATTACK
    if (state.ui.selected.unit !== null &&
        state.ui.selected.unit !== undefined &&
        isValidAttackTarget(state.game, selectedUnit, clickedUnit)
    ) {
        sendAction(state.game, ActionType.Attack, { 
            attacker: selectedUnit, 
            defender: clickedUnit,
        });
        unselect(state);        
    }
}

function unselect(state : FullState) {
    state.ui.selected.unit = null;
    state.ui.highlighted.tiles = {};
}