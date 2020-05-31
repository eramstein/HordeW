import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { moveUnit, passUnitTurn } from "../../../engine/battle/unit";
import { factionDone, nextTurn, allDone } from "../../../engine/battle/turn";
import { attack } from '../../../engine/battle/combat';
import { clearTempLog } from '../../../engine/battle/log';

const TURN_TIME = 1000;

export enum ActionType {
    Move = "MOVE",
    Attack = "ATTACK",
    Pass = "PASS",
}

export function sendAction(gs : GameState, actionType : ActionType, params : any) {

    clearTempLog(gs);

    // Send action to engine which will mutate the state
    switch (actionType) {
        case ActionType.Move:
            moveUnit(gs, params.unit, params.pos);
            break;

        case ActionType.Attack:
            attack(gs, params.attacker, params.defender);
            break;

        case ActionType.Pass:
            passUnitTurn(gs, params.unit);
            break;
    
        default:
            break;
    }

    setTimeout((gs) => {
        clearTempLog(gs);
        State.setGameState(gs);
    }, TURN_TIME, gs);

    loopTurns(gs, 0);
    
}

function loopTurns(gs, iteration) {
    console.log("auto turn loop ", iteration);
    if (factionDone(gs, 0) && !allDone(gs)) {
        setTimeout((gs) => {
            clearTempLog(gs);
            nextTurn(gs);
            State.setGameState(gs);
            loopTurns(gs, iteration + 1);
        }, TURN_TIME, gs);
    }
}