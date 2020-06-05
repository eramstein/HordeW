import { GameState } from "../../game";
import { Unit } from "../model";
import { getAttackableUnits, canUnitMove, passUnitTurn, getReachablePositions, getVisibleEnemiesInRange } from "../unit";
import { moveUnit } from "../movement";
import { attack } from "../combat";
import { getClosestEnemyLoseCondition, getClosestEnemySurviveCondition, getNextStepTowards } from "./utils";
import { getDistance } from "../board";

export function useUnitZombie(gs : GameState, unit : Unit) {
    const attackTargets = getAttackableUnits(gs, unit);
    if (attackTargets.length > 0) {
        doAttack(gs, unit, attackTargets);
    } else if (canUnitMove(gs, unit) && getVisibleEnemiesInRange(gs, unit).length === 0) {
        doMove(gs, unit);
    } else {
        passUnitTurn(gs, unit);
    }
}

// move towards nearest caravan
function doMove(gs : GameState, unit : Unit) {
    const target = getClosestEnemyLoseCondition(gs, unit) || getClosestEnemySurviveCondition(gs, unit);
    const canMoveTo = getReachablePositions(gs, unit);

    if (!target || canMoveTo.length === 0 || getDistance(unit.position, target.position) === 1) {
        passUnitTurn(gs, unit);
        return;
    }

    const goTo = getNextStepTowards(gs, canMoveTo, target.position);
    moveUnit(gs, unit, goTo);
}

// attack lowest HP ennemy
function doAttack(gs : GameState, unit : Unit, possibleTargets : Unit[]) {
    const sortedByHp = possibleTargets.sort((a, b) => a.hp - b.hp);    
    const target = sortedByHp[0];
    attack(gs, unit, target, false);
}