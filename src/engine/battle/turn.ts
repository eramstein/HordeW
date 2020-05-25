import { GameState } from "../game";
import { playAiTurn } from "./ai/ai";

export function nextTurn(gs : GameState) {
    gs.battle.currentFaction = (gs.battle.currentFaction + 1) % gs.battle.factions.length;
    if (!gs.battle.factions[gs.battle.currentFaction].isPlayer) {
        playAiTurn(gs);
        nextTurn(gs);
    }
}