import { GameState } from "../game";
import { playAiTurn } from "./ai/ai";
import { Unit } from "./model";

export function nextTurn(gs : GameState) {    

    gs.battle.currentFaction = (gs.battle.currentFaction + 1) % gs.battle.factions.length;

    const isPlayer = gs.battle.factions[gs.battle.currentFaction].isPlayer;

    if (allDone(gs)) {
        console.log("All done, next round");
        nextRound(gs);
        return;
    }

    if (factionDone(gs, gs.battle.currentFaction) && !isPlayer) {        
        console.log("Faction done, next turn", gs.battle.currentFaction);
        nextTurn(gs);
        return;
    }

    if (!isPlayer) {
        console.log("AI turn");        
        playAiTurn(gs);
    }
    
}

export function nextRound(gs : GameState) {
    gs.battle.round++;
    gs.battle.units.forEach(u => {
        u.movesCount = 0;
        u.attacksCount = 0;
        u.used = false;
    });
    gs.battle.currentFaction = 0;
}

export function allDone(gs : GameState) : boolean {
    return unitsDone(gs, gs.battle.units);
}

export function factionDone(gs : GameState, faction : number) : boolean {    
    return unitsDone(gs, gs.battle.units.filter(u => u.owner === faction));
}

export function unitsDone(gs : GameState, units : Unit[]) : boolean {
    return !units.filter(u => !u.passive).some(u => {
        return u.used === false;
    });
}