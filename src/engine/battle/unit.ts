import { UNITS } from "../../data/units/units"
import { Pos, Unit } from "./model";
import { GameState } from "../game";
import { getAdjacentPositions, TERRAIN_SPECS, getPositionsInRange, getDistance } from "./board";
import { nextTurn } from "./turn";

export function makeUnit(template : string, faction : number, pos : Pos) : Unit {
    const unit = { ...UNITS[template] };
    unit.id = template + Math.floor(Math.random() * 1000000000000000);
    unit.owner = faction;
    unit.position = pos;
    unit.hp = unit.hpMax;
    unit.morale = unit.moraleInit;
    unit.used = false;
    unit.movesCount = 0;
    unit.attacksCount = 0;
    return unit;
}

export function checkIfUnitExhausted(gs : GameState, unit : Unit) {
    if (unit.attacksCount > 0 && unit.movesCount > 0) {
        unit.used = true;
    }
}

export function moveUnit(gs : GameState, unit : Unit, pos : Pos) {
    const validPos = getReachablePositions(gs, unit).filter(p => p.x === pos.x && p.y === pos.y);
    
    if (validPos.length === 0) {
        console.log("invalid pos");        
        return;
    }
    
    unit.position = pos;
    unit.movesCount++;
    checkIfUnitExhausted(gs, unit);
    nextTurn(gs);
}

export function canUnitMove(gs : GameState, unit : Unit) : boolean {    
    return !unit.used && unit.movesCount === 0;
}

export function canUnitAttack(gs : GameState, unit : Unit) : boolean {    
    return !unit.used && unit.attacksCount === 0;
}

export function getReachablePositions(gs : GameState, unit : Unit) : Pos[] {
    if (unit.used || unit.movesCount > 0) {
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

// visibility: can we "go" from A to B in less than <range> moves without getting vision blocked?
// TODO: 2 issues: inefficient (we go in all directions) and works only fine at exactly <range> distance,
//                 it will return close tiles by going around obstacles
export function getVisiblePositions(gs : GameState, unit : Unit, range : number) : Pos[] {
    
    const positions = [];
    const visited = {};

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
                const movesLeftAfter = movesLeft - 1;
                const bestVisitBefore = visited[p.x + "." + p.y] === undefined ? -1 : visited[p.x + "." + p.y];
                if (!terrain.blocksVision &&
                    movesLeft > 0 &&
                    movesLeftAfter > bestVisitBefore) {
                    visit(p, movesLeftAfter);
                }
            });
        }

    }

    visit(unit.position, range);    
    
    return positions;
}

export function getAttackableUnits(gs : GameState, unit : Unit) : Unit[] {
    if (unit.used || unit.attacksCount > 0) {
        return [];
    }

    const unitsInRange = gs.battle.units.filter(u => {
        return u.owner !== unit.owner && getDistance(u.position, unit.position) <= (unit.range || 1);
    });    

    // TODO
    const visibleUnitsInRange = unitsInRange.filter(u => canSeeUnit(gs, unit, u));
    
    return visibleUnitsInRange;
}

export function damageUnit(gs : GameState, unit : Unit, damage : number) {
    if (damage <= 0) {
        return;
    }
    unit.hp -= damage;
    if (unit.hp < 0) {
        destroyUnit(gs, unit);
    }
}

export function destroyUnit(gs : GameState, unit : Unit) {
    gs.battle.units = gs.battle.units.filter(u => u.id !== unit.id);
    gs.battle.graveyard.push(unit);
}

export function canSeeUnit(gs : GameState, unit1 : Unit, unit2 : Unit) : boolean {
    const sourceUnitTerrain = TERRAIN_SPECS[gs.battle.tiles[unit2.position.x][unit2.position.y].terrain];
    const targetUnitTerrain = TERRAIN_SPECS[gs.battle.tiles[unit2.position.x][unit2.position.y].terrain];
    const dist = getDistance(unit1.position, unit2.position);

    // case distance 1: always see
    if (dist === 1) {
        return true;
    }

    // else, if unit2 is in blocking hex, it's hidden
    if (targetUnitTerrain.blocksVision) {
        return false;
    }

    // else, if unit1 is on higher ground, it always see
    if (sourceUnitTerrain.altitude > targetUnitTerrain.altitude) {
        return true;
    }

    // case distance 2 or 3: check if there is a path in less than 2 or 3 without blocking vision   
    if (dist === 2 || dist === 3) {
        const visibleTiles = getVisiblePositions(gs, unit1, dist);
        const visibleTilesMap = visibleTiles.reduce((acc, tile) => {
            acc[tile.x + "." + tile.y] = true;
            return acc;
        }, {});
        return !!visibleTilesMap[unit2.position.x + "." + unit2.position.y];
    }    

    // case distance 4+: artillery, always see (unless unit is in blocking hex, checked above)
    if (dist > 3) {
        return true;
    }

    return false;
}