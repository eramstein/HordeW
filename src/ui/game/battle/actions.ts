import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { moveUnit, passUnitTurn } from "../../../engine/battle/unit";
import { factionDone, nextTurn, allDone } from "../../../engine/battle/turn";
import { attack } from '../../../engine/battle/combat';
import { clearTempLog, clearPlayerTempLog } from '../../../engine/battle/log';
import { PLAYER_ANIMATION_DURATION, AI_ANIMATION_DELAY, AI_ANIMATION_DURATION } from './config';

export enum ActionType {
    Move = "MOVE",
    Attack = "ATTACK",
    Pass = "PASS",
}

export function sendAction(gs : GameState, actionType : ActionType, params : any) {

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

    // remove labels
    setTimeout((gs) => {
        clearPlayerTempLog(gs);
        State.setGameState(gs);
    }, PLAYER_ANIMATION_DURATION, gs);
    setTimeout((gs) => {
        clearTempLog(gs);
        State.setGameState(gs);
    }, PLAYER_ANIMATION_DURATION + AI_ANIMATION_DELAY + AI_ANIMATION_DURATION, gs);

    loopTurns(gs, gs.battle.round);
    
}

function loopTurns(gs, round) {
    console.log("auto turn loop ", round);
    if (factionDone(gs, 0) && !allDone(gs)) {
        setTimeout((gs) => {
            clearTempLog(gs);
            nextTurn(gs);
            State.setGameState(gs);
            loopTurns(gs, round);
        }, PLAYER_ANIMATION_DURATION + AI_ANIMATION_DELAY + AI_ANIMATION_DURATION, gs);        
    }
    if (gs.battle.round !== round) {
        setTimeout((gs) => {
            clearTempLog(gs);
            State.setGameState(gs);
        }, PLAYER_ANIMATION_DURATION + AI_ANIMATION_DELAY + AI_ANIMATION_DURATION, gs);
    }
}