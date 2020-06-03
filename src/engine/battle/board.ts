import { GameState } from "../game";
import { Tile, TerrainType, TerrainSpecs, Pos } from "./model";

/*
Hexagonal coordinates systems used: 2 dimensions, offset X by 1 every 2 rows
Note: a cube coordinates system would make more elegant algorithms, maybe a TODO for refactoring
      see this for inspiration: https://www.redblobgames.com/grids/hexagons/
      anyways the game engine use a few functions in this module that abstract the coordinate system
      refactoring might only be useful if AI has to use these algorithms many times quickly
*/

export const MAP_SIZE = 20;

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
    positions.push({ x: pos.x - 1, y: pos.y });
    positions.push({ x: pos.x + 1, y: pos.y });
    positions.push({ x: pos.x + shiftX, y: pos.y - 1 });
    positions.push({ x: pos.x + shiftX + 1, y: pos.y - 1 });
    positions.push({ x: pos.x + shiftX, y: pos.y + 1 });
    positions.push({ x: pos.x + shiftX + 1, y: pos.y + 1 });
    return getPositionsInMap(positions);
}

export function getPositionsInRange(pos : Pos, range : number) : Pos[] {
    const positions = [];
    for (let x = pos.x - range; x <= pos.x + range; x++) {
        for (let y = pos.y - range + Math.max(0, pos.x - x); y <= pos.y + range - Math.max(0, x - pos.x); y++) {
            const shiftX = (pos.y % 2 === 1 && y % 2 === 0) ? 1 : 0;            
            positions.push({ x: x + Math.floor((y-pos.y)/2) + shiftX, y });
        }        
    }
    return getPositionsInMap(positions);
}

export function getPositionsInRangeRange(pos : Pos, range : number, minRange : number) : Pos[] {
    const positions = [];
    for (let x = pos.x - range; x <= pos.x + range; x++) {
        for (let y = pos.y - range + Math.max(0, pos.x - x); y <= pos.y + range - Math.max(0, x - pos.x); y++) {
            const shiftX = (pos.y % 2 === 1 && y % 2 === 0) ? 1 : 0;
            const pos2 = { x: x + Math.floor((y-pos.y)/2) + shiftX, y };
            // TODO: there must be a more efficient way, seems redundant
            if (getDistance(pos, pos2) >= minRange) {
                positions.push({ x: x + Math.floor((y-pos.y)/2) + shiftX, y });
            }            
        }
    }
    return getPositionsInMap(positions);
}

export function getDistance(pos1 : Pos, pos2 : Pos) : number {
    let x1 = pos1.x;
    let x2 = pos2.x;
    let y1 = pos1.y;
    let y2 = pos2.y;
    // un-apply offset
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

export function getPositionsInMap(posArray : Pos[]) : Pos[] {
    return posArray.filter(p => p.x >= 0 && p.x < MAP_SIZE && p.y >= 0 && p.y < MAP_SIZE);
}