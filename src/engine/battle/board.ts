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

export function getDistance(pos1 : Pos, pos2 : Pos) : number {
    let x1 = pos1.x;
    let x2 = pos2.x;
    let y1 = pos1.y;
    let y2 = pos2.y;
    // un-apply the "visual shift" we do on the map to make it squarish (e.g. 1.2 is actually 0.2)
    x1 -= Math.floor(y1/2);
    x2 -= Math.floor(y2/2);
    // distance calc : if x and y change in the same direction, add up distances on each dimension
    // else, the max projected distance on either dimension is the distance (the other dim is irrelevant, doesn't add to the dist)
    const xDiff = x1 - x2;
    const yDiff = y1 - y2;
    if (xDiff >= 0 && yDiff >= 0 || xDiff <= 0 && yDiff <= 0) { 
        return Math.abs(xDiff) + Math.abs(yDiff);
    } else {
        return Math.max(Math.abs(xDiff), Math.abs(yDiff));
    }    
}