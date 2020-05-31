import { GameState } from "../game";
import { Log } from "./model";

export function clearTempLog(gs : GameState) {    
    gs.battle.tempLog = [];
}

export function clearPlayerTempLog(gs : GameState) {
    gs.battle.tempLog = gs.battle.tempLog.filter(log => {
        return !log.entity || log.entity.owner !== 0;
    });
}

export function addLog(gs : GameState, log : Log) {
    log.currentFaction = gs.battle.currentFaction;
    gs.battle.log.push(log);
    gs.battle.tempLog.push(log);
}