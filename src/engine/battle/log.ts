import { GameState } from "../game";
import { Log } from "./model";

export function clearAiLog(gs : GameState) {
    gs.battle.aiLog = [];
}

export function addLog(gs : GameState, log : Log) {
    gs.battle.log.push(log);
    if (gs.battle.currentFaction !== 0) {
        gs.battle.aiLog.push(log);
    }    
}