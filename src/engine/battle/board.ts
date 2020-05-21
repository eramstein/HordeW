import { GameState } from "../game";
import { Tile, TerrainType, TerrainSpecs } from "./model";

export const TERRAIN_SPECS : { [key in TerrainType] : TerrainSpecs } = {
    [TerrainType.Plains]: {
        movementCost: 1,
        altitude: 0,
    },
    [TerrainType.Forest]: {
        blocksVision: true,
        movementCost: 2,
        altitude: 0,
    },
    [TerrainType.Hills]: {
        movementCost: 1,
        altitude: 1,
    },
    [TerrainType.Mountain]: {
        blocksMovement: true,
        blocksVision: true,
        movementCost: 2,
        altitude: 2,
    },
    [TerrainType.Water]: {
        blocksMovement: true,
        blocksVision: false,
        movementCost: 1,
        altitude: 0,
    },
    [TerrainType.WaterShallow]: {
        blocksMovement: false,
        blocksVision: false,
        movementCost: 2,
        altitude: -1,
    },
}

export function updateTile(gs : GameState, x : number, y : number, tile : Tile) {
    gs.battle.tiles[x][y] = tile;
}