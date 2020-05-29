import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { moveUnit, passUnitTurn } from "../../../engine/battle/unit";
import { factionDone } from "../../../engine/battle/turn";
import { attack } from '../../../engine/battle/combat';
import { clearTempLog } from '../../../engine/battle/log';

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
    
}