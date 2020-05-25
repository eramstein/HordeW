import { FullState } from "../../model";
import { TerrainType } from "../../../engine/battle/model";
import { updateTile } from "../../../engine/battle/board";
import { moveUnit, getReachablePositions } from "../../../engine/battle/unit";

export const PADDING = 20;
export const TILE_HEIGHT = 75;
export const TILE_WIDTH = Math.sqrt(3)/2 * TILE_HEIGHT;

export function onClickTile(state : FullState, x, y) {
    // TERRAIN EDIT
    if (state.ui.tools.terrainEditor && state.ui.tools.terrainType) {
        const oldTile = state.game.battle.tiles[x][y];
        updateTile(state.game, x, y, { ...oldTile, terrain: TerrainType[state.ui.tools.terrainType] });
    }
    // UNIT MOVE
    if (state.ui.selected.unit !== null) {
        moveUnit(state.game, state.game.battle.units[state.ui.selected.unit], { x, y });
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
        const reachableTiles = getReachablePositions(state.game, state.game.battle.units[unitIndex]);        
        reachableTiles.forEach(t => {
            state.ui.highlighted.tiles[t.x + "." + t.y] = true;
        });        
    }    
}

function unselect(state : FullState) {
    state.ui.selected.unit = null;
    state.ui.highlighted.tiles = {};
}