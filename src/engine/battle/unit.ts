import { UNITS } from "../../data/units/units"
import { Pos, Unit, LogType } from "./model";
import { GameState } from "../game";
import { getAdjacentPositions, TERRAIN_SPECS, getDistance } from "./board";
import { nextTurn } from "./turn";
import { addLog } from "./log";
import { checkWinStateOnUnitDestruction } from "./winCondition";
import { newAbility } from "./ability/ability";

export function makeUnit(template : string, faction : number, pos : Pos) : Unit {
    const unit = { ...UNITS[template] };
    unit.id = template + Math.floor(Math.random() * 1000000000000000);
    unit.owner = faction;
    unit.position = pos;
    unit.hp = unit.hpMax;    
    unit.used = false;
    unit.movesCount = 0;
    unit.attacksCount = 0;
    unit.armor = unit.armor || 0;
    unit.abilities = UNITS[template].abilities.map(a => newAbility(a));
    unit.endOfRound = defaultTempEffects();
    unit.endOfTurn = defaultTempEffects();
    unit.cc = defaultCrowdControl();
    if (unit.energyMax) {
        unit.energy = unit.energyMax;
    }    
    return unit;
}

export const defaultTempEffects = () => {
    return {
        meleeAttack: 0,
        damageShield: 0,
        dot: 0,
        hot: 0,        
    };    
};

export const defaultCrowdControl = () => {
    return {
        mezz: 0,
        stun: 0,
        root: 0,
    };    
};


export function restoreUnitAbilities(unit : Unit) {
    unit.abilities = UNITS[unit.template] && UNITS[unit.template].abilities.map(a => newAbility(a));    
}

export function checkIfUnitExhausted(gs : GameState, unit : Unit) {
    const minAbilityCost = unit.abilities.reduce((agg, ability) => {
        return Math.min(ability.cost || 0, agg);
    }, Infinity);
    const enoughEnergyForAbility = unit.energy && unit.energy >= minAbilityCost;    
    if (unit.attacksCount > 0) {
        unit.used = true;
    }
    if (unit.movesCount > 0 && !enoughEnergyForAbility) {
        const enemiesInRange = getAttackableUnits(gs, unit);
        if (getAttackableUnits.length === 0) {
            unit.used = true;
        }        
    }
}

export function passUnitTurn(gs : GameState, unit : Unit) {    
    unit.used = true;

    addLog(gs, {
        type: LogType.Pass,
        entity: unit,
        text: `${unit.name} passed`,
    });

    nextTurn(gs);
}

export function canUnitDoAnything(gs : GameState, unit : Unit) : boolean {
    return unit.used === false && !unit.cc.mezz && !unit.cc.stun;
}

export function canUnitMove(gs : GameState, unit : Unit) : boolean {    
    return !unit.used && !unit.cc.mezz && !unit.cc.stun && !unit.cc.root && unit.movement > 0 && unit.movesCount === 0;
}

export function canUnitAttack(gs : GameState, unit : Unit) : boolean {
    return !unit.used && !unit.cc.mezz && !unit.cc.stun && !unit.defender && unit.attacksCount === 0;
}

export function canUnitOpportunityAttack(gs : GameState, unit : Unit) : boolean {    
    return !unit.defender;
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
                const tile = gs.battle.tiles[p.x][p.y];
                const terrain = TERRAIN_SPECS[tile.terrain];
                const cost = unit.terrains && unit.terrains[tile.terrain] ? 1 : terrain.movementCost;                
                const movesLeftAfter = movesLeft - cost;
                const bestVisitBefore = visited[p.x + "." + p.y] === undefined ? -1 : visited[p.x + "." + p.y];
                if (!terrain.blocksMovement &&
                    movesLeft >= cost &&
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
    if (canUnitAttack(gs, unit) === false) {
        return [];
    }    
    return getVisibleEnemiesInRange(gs, unit);
}

export function getEnemiesInRange(gs : GameState, unit : Unit) : Unit[] {
    const canShoot = unit.range && !isEngagedInMelee(gs, unit);
    return gs.battle.units.filter(u => {
        return u.owner !== unit.owner && getDistance(u.position, unit.position) <= (canShoot ? unit.range : 1);
    });
}

export function getVisibleEnemiesInRange(gs : GameState, unit : Unit) : Unit[] {
    const unitsInRange = getEnemiesInRange(gs, unit);
    return unitsInRange.filter(u => canSeeUnit(gs, unit, u.position));
}

export function isEngagedInMelee(gs : GameState, unit : Unit) : boolean {
    let result = false;
    gs.battle.units.forEach(u => {
        if (unit.owner !== u.owner
            && canUnitOpportunityAttack(gs, u)
            && getDistance(u.position, unit.position) === 1) {
                result = true;
        }
    });
    return result;
}

export function damageUnit(gs : GameState, unit : Unit, damage : number) {
    if (damage <= 0) {
        return;
    }

    addLog(gs, {
        type: LogType.Damage,
        entity: { ...unit },
        data: { damage },
        text: `${unit.name} gets ${damage} damage`,
    });

    unit.hp -= damage;
    unit.cc.mezz = null;

    if (unit.hp <= 0) {
        destroyUnit(gs, unit);
    }
}

export function destroyUnit(gs : GameState, unit : Unit) {
    gs.battle.units = gs.battle.units.filter(u => u.id !== unit.id);
    gs.battle.graveyard.push(unit);
    checkWinStateOnUnitDestruction(gs, unit);
}

export function canSeeUnit(gs : GameState, unit : Unit, targetUnitPos : Pos) : boolean {
    const sourceUnitTerrain = TERRAIN_SPECS[gs.battle.tiles[targetUnitPos.x][targetUnitPos.y].terrain];
    const targetUnitTerrain = TERRAIN_SPECS[gs.battle.tiles[targetUnitPos.x][targetUnitPos.y].terrain];
    const dist = getDistance(unit.position, targetUnitPos);

    // case distance 1: always see
    if (dist === 1) {
        return true;
    }

    // else, if targetUnitPos is in blocking hex, it's hidden
    if (targetUnitTerrain.blocksVision) {
        return false;
    }

    // else, if unit is on higher ground, it always see
    if (sourceUnitTerrain.altitude > targetUnitTerrain.altitude) {
        return true;
    }

    // case distance 2 or 3: check if there is a path in less than 2 or 3 without blocking vision   
    if (dist === 2 || dist === 3) {
        const visibleTiles = getVisiblePositions(gs, unit, dist);
        const visibleTilesMap = visibleTiles.reduce((acc, tile) => {
            acc[tile.x + "." + tile.y] = true;
            return acc;
        }, {});
        return !!visibleTilesMap[targetUnitPos.x + "." + targetUnitPos.y];
    }    

    // case distance 4+: artillery, always see (unless unit is in blocking hex, checked above)
    if (dist > 3) {
        return true;
    }

    return false;
}

export function healUnit(gs : GameState, unit : Unit, value : number) {        
    unit.hp += value;
    unit.hp = Math.min(unit.hp, unit.hpMax);
}

export function mezzUnit(gs : GameState, unit : Unit, value : number) {        
    unit.cc.mezz += value;
}

export function stunUnit(gs : GameState, unit : Unit, value : number) {        
    unit.cc.stun += value;
}

export function rootUnit(gs : GameState, unit : Unit, value : number) {        
    unit.cc.root += value;
}

export function energizeUnit(gs : GameState, unit : Unit, value : number) {
    unit.energy += value;
}