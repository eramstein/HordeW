import { UNITS } from "../../data/units/units"
import { Pos, Unit } from "./model";
import { GameState } from "../game";
import { getAdjacentPositions, TERRAIN_SPECS } from "./board";
import { nextTurn } from "./turn";

export function makeUnit(template : string, faction : number, pos : Pos) : Unit {
    const unit = { ...UNITS[template] };
    unit.owner = faction;
    unit.position = pos;
    unit.hp = unit.hpMax;
    unit.morale = unit.moraleInit;
    unit.used = false;
    unit.movesCount = 0;
    unit.attacksCount = 0;
    return unit;
}

export function moveUnit(gs : GameState, unit : Unit, pos : Pos) {    
    unit.position = pos;
    unit.movesCount++;
    nextTurn(gs);
}

export function canUnitMove(gs : GameState, unit : Unit) : boolean {    
    return unit.movesCount === 0;
}

export function canUnitAttack(gs : GameState, unit : Unit) : boolean {    
    return unit.attacksCount === 0;
}

export function getReachablePositions(gs : GameState, unit : Unit) : Pos[] {
    if (unit.used) {
        return [];
    }

    const positions = [];
    const visited = {};

    const occupied = gs.battle.units.reduce((acc, unit) => {
        acc[unit.position.x + "." + unit.position.y] = unit.owner;
        return acc;
    }, {});

    function visit(pos : Pos, movesLeft : number) { 
        
        if (visited[pos.x + "." + pos.y] === undefined) {
            positions.push(pos);
            visited[pos.x + "." + pos.y] = movesLeft; 
        } else {
            if (movesLeft > visited[pos.x + "." + pos.y]) {
                visited[pos.x + "." + pos.y] = movesLeft;
            }           
        }

        if (movesLeft > 0) {
            const adj = getAdjacentPositions(pos);            
            adj.forEach(p => {
                const terrain = TERRAIN_SPECS[gs.battle.tiles[p.x][p.y].terrain];
                const movesLeftAfter = movesLeft - terrain.movementCost;
                const bestVisitBefore = visited[p.x + "." + p.y] === undefined ? -1 : visited[p.x + "." + p.y];
                if (!terrain.blocksMovement &&
                    movesLeft >= terrain.movementCost &&
                    // all units, ennemies or allies, block (to change, check if occupied === unit.owner)
                    occupied[p.x + "." + p.y] === undefined &&
                    movesLeftAfter > bestVisitBefore) {
                    visit(p, movesLeftAfter);
                }
            });
        }

    }

    visit(unit.position, unit.movement);    
    
    return positions;
}