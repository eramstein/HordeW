import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { passUnitTurn } from "../../../engine/battle/unit";
import { moveUnit } from "../../../engine/battle/movement";
import { factionDone, nextTurn, allDone } from "../../../engine/battle/turn";
import { attack } from '../../../engine/battle/combat';
import { clearTempLog, clearPlayerTempLog } from '../../../engine/battle/log';
import { PLAYER_ANIMATION_DURATION, AI_ANIMATION_DELAY, AI_ANIMATION_DURATION } from './config';
import { playAiTurn } from '../../../engine/battle/ai/ai';
import { playAbility } from '../../../engine/battle/ability/ability';

export enum ActionType {
    Move = "MOVE",
    Attack = "ATTACK",
    Pass = "PASS",
    Ability = "ABILITY",
}

export function sendAction(gs : GameState, actionType : ActionType, params : any) {

    // Send action to engine which will mutate the state
    switch (actionType) {
        case ActionType.Move:
            moveUnit(gs, params.unit, params.pos);
            break;

        case ActionType.Attack:
            attack(gs, params.attacker, params.defender, false);
            break;

        case ActionType.Pass:
            passUnitTurn(gs, params.unit);
            break;

        case ActionType.Ability:
            playAbility(gs, params.unit, params.ability, params.targetUnits, params.targetPositions);
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
    console.log("auto turn loop ");
    if (!gs.battle.factions[gs.battle.currentFaction].isPlayer) {
        console.log("AI turn");        
        playAiTurn(gs);
    }
    if (factionDone(gs, 0) && !allDone(gs)) {
        setTimeout((gs) => {
            nextTurn(gs);
            clearTempLog(gs);
            playAiTurn(gs);
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