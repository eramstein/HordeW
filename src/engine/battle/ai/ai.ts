import { GameState } from "../../game";
import { shuffle, pickFrom } from "../../../utils/random";
import { Ability, playAbility, getEligibleTargets, TriggerType } from "../ability";
import { Unit } from "../unit";
import { nextRound, isActionLeft } from "../turn";
import { playAiRoundRandom } from "./personaRandom";

export enum Persona {
    Random = "RANDOM",
}

export enum ActionType {
    PlayCard = "PLAY_CARD",
    Move = "MOVE",
    Attack = "ATTACK",
}

export enum OpenActionType {
    PlayCard = "PLAY_CARD",
    Unit = "UNIT",
}

export interface OpenAction {
    type: OpenActionType,
    entity: any,
}

export enum AiLogType {
    AttackTower = "ATTACK_TOWER",
    AttackUnit = "ATTACK_UNIT",
}

export interface AiLog {
    type: AiLogType,
    entity: any,
    target: any,
}

export function playAiAbility(gs : GameState, unit : Unit, ability : Ability) {    
    let targets : Unit[] = [];

    if (!ability.target) {
        targets = null;
    } else {
        const eligibleTargets = getEligibleTargets(gs, unit, ability);        
        targets = pickFrom(eligibleTargets, ability.target.count);
    }

    if (!ability.target || ability.target.count <= targets.length) {
        playAbility(gs, unit, ability, targets);
    } else {
        nextRound(gs, false);
    }    
}

export function playAiRound(gs : GameState) {
    console.log('playAiRound');

    const actions = isActionLeft(gs, false);    

    if (actions.length === 0) {        
        gs.battle.foePassed = true;
        nextRound(gs, true);
        return;
    }

    playAiRoundRandom(gs, actions);

    // if it's still AI's round, it means something went wrong so we pass
    if (!gs.battle.playersRound) {
        console.log("AI action impossible, passing");        
        gs.battle.foePassed = true;
        nextRound(gs, true);
        return;
    }
}


export function clearLog(gs : GameState) {
    gs.battle.aiLog = [];
}