import { State } from '../../../stores';
import { GameState } from "../../../engine/game";
import { passUnitTurn } from "../../../engine/battle/unit";
import { moveUnit } from "../../../engine/battle/movement";
import { factionDone, nextTurn, allDone } from "../../../engine/battle/turn";
import { attack } from '../../../engine/battle/combat';
import { clearTempLog, clearPlayerTempLog } from '../../../engine/battle/log';
import { playAiTurn } from '../../../engine/battle/ai/ai';
import { playAbility } from '../../../engine/battle/ability/ability';
import { animateLog } from './animateLog';

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

    const animationTime = animateLog(gs.battle.tempLog);
    clearPlayerTempLog(gs);

    if (!gs.battle.factions[gs.battle.currentFaction].isPlayer) {
        loopAiTurns(gs, gs.battle.round, animationTime);
    }    
    
}

function loopAiTurns(gs, round, waitFor) {
    console.log("Loop AI turn", waitFor);

    playAiTurn(gs);
    State.setAnimationDelay(waitFor);
    setTimeout((gs) => {
        const animationTime = animateLog(gs.battle.tempLog);
        setTimeout((gs) => {
            clearTempLog(gs);
            State.setGameState(gs);
        }, animationTime, gs);

        if (factionDone(gs, 0) && !allDone(gs)) {
            setTimeout((gs) => {
                nextTurn(gs);
                clearTempLog(gs);
                loopAiTurns(gs, round, animationTime);
            }, animationTime, gs);
        }

    }, waitFor, gs);
    
    if (gs.battle.round !== round) {
        // TODO: new round banner
    }
}