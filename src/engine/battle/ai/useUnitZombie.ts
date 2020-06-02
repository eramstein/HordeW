import { GameState } from "../../game";
import { Unit } from "../model";
import { getAttackableUnits, canUnitMove, passUnitTurn, getReachablePositions, moveUnit } from "../unit";
import { AiActionType } from "./ai";
import { pickFrom } from "../../../utils/random";
import { attack } from "../combat";

export function useUnitZombie(gs : GameState, unit : Unit) {

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