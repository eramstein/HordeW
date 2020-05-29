import { GameState } from "../game";
import { Log } from "./model";

export function clearTempLog(gs : GameState) {
    gs.battle.tempLog = [];
}

export function addLog(gs : GameState, log : Log) {
    gs.battle.log.push(log);
    if (gs.battle.currentFaction !== 0) {
        gs.battle.tempLog.push(log);
    }    
}