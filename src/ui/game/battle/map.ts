import { FullState } from "../../model";
import { State } from '../../../stores';
import { Tile, TerrainType } from "../../../engine/battle/model";
import { updateTile } from "../../../engine/battle/board";

export function onClickTile(state : FullState, x, y) {
    if (state.ui.tools.terrainEditor && state.ui.tools.terrainType) {
        const oldTile = state.game.battle.tiles[x][y];
        updateTile(state.game, x, y, { ...oldTile, terrain: TerrainType[state.ui.tools.terrainType] });
    }
}