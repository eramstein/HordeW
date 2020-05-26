import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { moveUnit } from "../../../engine/battle/unit";
import { factionDone, nextTurn } from "../../../engine/battle/turn";

const AUTO_PASS_DELAY = 1000;

export enum ActionType {
    Move = "MOVE",
}

export function sendAction(gs : GameState, actionType : ActionType, params : any) {

    // Send action to engine which will mutate the state
    switch (actionType) {
        case ActionType.Move:
            moveUnit(gs, params.unit, params.pos);
            break;
    
        default:
            break;
    }

    // If player has no move, auto-pass after x ms
    if (factionDone(gs, 0)) {
        setTimeout(State.passTurn, AUTO_PASS_DELAY, gs);        
    }
    
}