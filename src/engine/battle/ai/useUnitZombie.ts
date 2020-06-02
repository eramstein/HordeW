import { GameState } from "../../game";
import { Unit } from "../model";
import { getAttackableUnits, canUnitMove, passUnitTurn, getReachablePositions, moveUnit } from "../unit";
import { attack } from "../combat";
import { getClosestEnemyLoseCondition, getClosestEnemySurviveCondition, getNextStepTowards } from "./utils";

export function useUnitZombie(gs : GameState, unit : Unit) {
    const attackTargets = getAttackableUnits(gs, unit);
    if (attackTargets.length > 0) {
        doAttack(gs, unit, attackTargets);
    } else if (canUnitMove(gs, unit)) {
        doMove(gs, unit);
    } else {
        passUnitTurn(gs, unit);
    }
}

// move towards nearest caravan
function doMove(gs : GameState, unit : Unit) {
    const canMoveTo = getReachablePositions(gs, unit);
    if (canMoveTo.length === 0) {
        passUnitTurn(gs, unit);
        return;
    }
    const closestLoseCon = getClosestEnemyLoseCondition(gs, unit);
    if (closestLoseCon) {
        const goTo = getNextStepTowards(gs, canMoveTo, closestLoseCon.position);
        moveUnit(gs, unit, goTo);

    } else {
        const closestSurviveCon = getClosestEnemySurviveCondition(gs, unit);        
        if (closestSurviveCon) {            
            const goTo = getNextStepTowards(gs, canMoveTo, closestSurviveCon.position);
            moveUnit(gs, unit, goTo);
        } else {
            passUnitTurn(gs, unit);
        }
    }
}

// attack lowest HP ennemy
function doAttack(gs : GameState, unit : Unit, possibleTargets : Unit[]) {
    const sortedByHp = possibleTargets.sort((a, b) => a.hp - b.hp);    
    const target = sortedByHp[0];
    attack(gs, unit, target);
}