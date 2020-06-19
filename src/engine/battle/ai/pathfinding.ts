import { GameState } from "../../game";
import { Unit, Pos, Tile, TerrainType } from "../model";
import { PriorityQueue } from "../../../utils/priorityQueue";
import { getAdjacentPositions, TERRAIN_SPECS, getDistance } from "../board";

const posToString = p => p.x + "." + p.y;

// A*
export function getPathTo(gs : GameState, unit : Unit, goal : Pos) : Pos[] {
    //const t0 = performance.now();

    const start = unit.position;
    const frontier = new PriorityQueue();
    frontier.push([start, 0]);
    const cameFrom = {}
    const costSoFar = {}
    cameFrom[posToString(start)] = null;
    costSoFar[posToString(start)] = null;

    const occupied = gs.battle.units.reduce((acc, unit) => {
        acc[posToString(unit.position)] = unit.owner;
        return acc;
    }, {});

    while (!frontier.isEmpty()) {

        const current = frontier.pop();    

        if (current[0].x === goal.x && current[0].y === goal.y) {
            break;
        }

        const neighbours = getAdjacentPositions(current[0]);

        neighbours.forEach(next => {
            const nextId = posToString(next);
            const tile = gs.battle.tiles[next.x][next.y];
            const terrainSpecs = TERRAIN_SPECS[tile.terrain];
            
            if (terrainSpecs.blocksMovement || occupied[nextId] !== undefined) { return; }

            const newCost = costSoFar[posToString(current[0])] + getCost(unit, tile);            
            if (!costSoFar[nextId] || newCost < costSoFar[nextId]) {
                const priority = newCost + heuristic(goal, next);
                costSoFar[nextId] = newCost;
                frontier.push([next, priority])
                cameFrom[nextId] = current[0];
            }                
        });
           
    }

    const path = rollBackPath(cameFrom, goal, start);
    // const t1 = performance.now();
    // console.log(`pathfinding - ${t1 - t0} ms`);

    return path;
}

function getCost(unit : Unit, tile : Tile) {
    return unit.terrains && unit.terrains[tile.terrain] ? 1 : TERRAIN_SPECS[tile.terrain].movementCost;
}

// how far pos is from goal
function heuristic(goal : Pos, pos : Pos) : number {
    return getDistance(goal, pos);
}

function rollBackPath(cameFrom : {}, goal : Pos, start : Pos) : Pos[] {
    let path = [];
    let current = goal;

    while (posToString(current) !== posToString(start)) {
        current = cameFrom[posToString(current)];
        path.push(current);
    }
    
    return path.reverse();
}