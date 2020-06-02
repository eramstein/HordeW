import { GameState } from "../../game";
import { Unit, Pos } from "../model";
import { getDistance } from "../board";

export function getClosestEnemyLoseCondition(gs : GameState, unit : Unit) : Unit {
    const loseCons = gs.battle.units.filter(u => u.loseCondition && u.owner !== unit.owner);
    if (loseCons.length === 0) {
        return null;
    }
    const sorted = loseCons.sort((a, b) => {
        return getDistance(unit.position, a.position) - getDistance(unit.position, b.position);
    });    
    return sorted[0];
}

export function getClosestEnemySurviveCondition(gs : GameState, unit : Unit) : Unit {
    const loseCons = gs.battle.units.filter(u => u.surviveCondition && u.owner !== unit.owner);
    if (loseCons.length === 0) {
        return null;
    }
    const sorted = loseCons.sort((a, b) => {
        return getDistance(unit.position, a.position) - getDistance(unit.position, b.position);
    });    
    return sorted[0];
}

// what is the closest position from target among the possible ones?
export function getNextStepTowards(gs : GameState, reachablePositions : Pos[], targetPosition : Pos) : Pos {    
    // dumb version: just consider distance
    let closestDistance = Infinity;
    let closestPos;    
    reachablePositions.forEach(pos => {      
        const dist = getDistance(pos, targetPosition);
        if (dist < closestDistance) {
            closestPos = pos;
            closestDistance = dist;
        }
    });
    return closestPos;
}   