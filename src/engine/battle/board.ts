import { GameState } from "../game";
import { Tile, TerrainType, TerrainSpecs, Pos } from "./model";

// TODO: don't hardcode
const MAP_SIZE = 20;

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

export function getAdjacentPositions(pos : Pos) : Pos[] {
    const positions = [];
    const shiftX = (pos.y % 2 === 0) ? -1 : 0;
    if (pos.x > 0) {
        positions.push({ x: pos.x - 1, y: pos.y });
    }
    if (pos.x < MAP_SIZE - 1) {
        positions.push({ x: pos.x + 1, y: pos.y });
    }
    if (pos.x + shiftX >= 0 && pos.y > 0) {
        positions.push({ x: pos.x + shiftX, y: pos.y - 1 });
    }
    if (pos.x + shiftX + 1 < MAP_SIZE && pos.y > 0) {
        positions.push({ x: pos.x + shiftX + 1, y: pos.y - 1 });
    }
    if (pos.x + shiftX >= 0 && pos.y < MAP_SIZE - 1) {
        positions.push({ x: pos.x + shiftX, y: pos.y + 1 });
    }
    if (pos.x + shiftX + 1 < MAP_SIZE && pos.y < MAP_SIZE - 1) {
        positions.push({ x: pos.x + shiftX + 1, y: pos.y + 1 });
    }
    return positions;
}