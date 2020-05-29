import { GameState } from "../../game";
import { getActiveUnits } from "../faction";
import { pickFrom } from "../../../utils/random";
import { Unit } from "../model";
import { moveUnit, getReachablePositions, canUnitMove, canUnitAttack, passUnitTurn, getAttackableUnits } from "../unit";
import { nextTurn } from "../turn";
import { attack } from "../combat";

export enum AiActionType {
    Attack = "ATTACK",
    Move = "MOVE",
}

export function playAiTurn(gs : GameState) {    
    const activeUnit = pickFrom(getActiveUnits(gs, gs.battle.currentFaction), 1)[0];    
    if (activeUnit) {
        useUnit(gs, activeUnit);
    } else {
        nextTurn(gs);
    }
}

function useUnit(gs : GameState, unit : Unit) {

    const possibleActions : AiActionType[] = [];
    const attackTargets = getAttackableUnits(gs, unit);
    if (canUnitMove(gs, unit)) {
        possibleActions.push(AiActionType.Move);
    }
    if (attackTargets.length > 0) {
        possibleActions.push(AiActionType.Attack);
    }

    if (possibleActions.length === 0) {
        passUnitTurn(gs, unit);
    }

    const pickedAction = pickFrom(possibleActions, 1)[0];
    switch(pickedAction) {        
        
        case AiActionType.Move:
            doMove(gs, unit);
        break;

        case AiActionType.Attack:
            doAttack(gs, unit, attackTargets);
        break;
        
        default: return;
    }
    
}

function doMove(gs : GameState, unit : Unit) {
    const canMoveTo = getReachablePositions(gs, unit);
    if (canMoveTo.length === 0) {
        passUnitTurn(gs, unit);
        return;
    }
    const moveTo = pickFrom(canMoveTo, 1)[0];
    moveUnit(gs, unit, moveTo);   
}

function doAttack(gs : GameState, unit : Unit, possibleTargets : Unit[]) {
    if (possibleTargets.length === 0) {
        passUnitTurn(gs, unit);
        return;
    }
    const target = pickFrom(possibleTargets, 1)[0];
    attack(gs, unit, target);
}