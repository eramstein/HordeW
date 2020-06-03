import { GameState } from "../../game";
import { Unit } from "../model";
import { getAttackableUnits, canUnitMove, passUnitTurn, getReachablePositions } from "../unit";
import { moveUnit } from "../movement";
import { AiActionType, AiPersoPrefs } from "./ai";
import { pickFrom } from "../../../utils/random";
import { attack } from "../combat";
import { preProcessTiles } from "./preProcessTiles";

export function useUnitRaider(gs : GameState, unit : Unit) {
    preProcessTiles(gs, unit);    
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
    attack(gs, unit, target, false);
}