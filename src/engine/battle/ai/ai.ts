import { GameState } from "../../game";
import { getActiveUnits } from "../faction";
import { pickFrom } from "../../../utils/random";
import { Unit } from "../model";
import { moveUnit, getReachablePositions } from "../unit";
import { nextTurn } from "../turn";

export function playAiTurn(gs : GameState) {    
    const activeUnit = pickFrom(getActiveUnits(gs, gs.battle.currentFaction), 1)[0];    
    if (activeUnit) {
        useUnit(gs, activeUnit);
    }    
}

export function useUnit(gs : GameState, unit : Unit) {
    const canMoveTo = getReachablePositions(gs, unit);
    if (canMoveTo.length > 0) {
        const moveTo = pickFrom(canMoveTo, 1)[0];
        moveUnit(gs, unit, moveTo);
    } else {
        unit.movesCount++;
        nextTurn(gs);
    }    
}