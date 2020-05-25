import { GameState } from "../game";
import { playAiTurn } from "./ai/ai";
import { canUnitMove } from "./unit";

export function nextTurn(gs : GameState) {
    gs.battle.currentFaction = (gs.battle.currentFaction + 1) % gs.battle.factions.length;
    if (!gs.battle.factions[gs.battle.currentFaction].isPlayer) {
        playAiTurn(gs);
        if (allDone(gs)) {
            nextRound(gs);
        } else {
            nextTurn(gs);
        }        
    } else {
        if (allDone(gs)) {
            nextRound(gs);
        }
    }    
}

export function nextRound(gs : GameState) {
    gs.battle.round++;
    gs.battle.units.forEach(u => {
        u.movesCount = 0;
        u.attacksCount = 0;
    });
}

export function allDone(gs : GameState) : boolean {
    return !gs.battle.units.some(u => {
        return canUnitMove(gs, u);
    });
}