import { GameState } from "../game";
import { Unit, LogType, TriggerType } from "./model";
import { damageUnit, healUnit, canUnitDoAnything } from "./unit";
import { addLog } from "./log";
import { applyTempEffects } from "./ability/effects";
import { triggerAbilities } from "./ability/listeners";

export function nextTurn(gs : GameState) {
    console.log("next turn", gs.battle.currentFaction);

    resetTurnEffects(gs);

    gs.battle.currentUnit = null;
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
    
}

export function nextRound(gs : GameState) {
    addLog(gs, {
        type: LogType.RoundEnd,
        entity: gs.battle.round,
        text: `End of round ${gs.battle.round}`,
    });
    triggerAbilities(gs, TriggerType.EndOfRound, {});
    applyRoundEffects(gs);
    resetRoundEffects(gs);
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
        return canUnitDoAnything(gs, u);
    });
}

function resetRoundEffects(gs : GameState) {
    gs.battle.units.forEach(u => { updateRoundTempEffects(u) });
    gs.battle.units.forEach(u => { updateCC(u) });
}

function resetTurnEffects(gs : GameState) {
    gs.battle.units.forEach(u => { updateTurnTempEffects(u) });    
}

function applyRoundEffects(gs : GameState) {
    gs.battle.units.forEach(u => {
        decrementAbilitiesDuration(u);
    });
}

function decrementAbilitiesDuration(unit : Unit) {
    unit.abilities.filter(a => a.duration !== undefined).forEach((a, i) => {
        a.duration--;
    });
    unit.abilities = unit.abilities.filter(a => a.duration !== 0);
}

function updateCC(unit : Unit) {
    unit.cc = {
        mezz: Math.max(unit.cc.mezz - 1, 0),
        stun: Math.max(unit.cc.stun - 1, 0),
        root: Math.max(unit.cc.root - 1, 0),
    };
}

function updateRoundTempEffects(unit : Unit) {
    unit.endOfRound.forEach(tempEffect => {
        tempEffect.duration--;
        if (tempEffect.duration <= 0) {
            applyTempEffects(tempEffect.effects, unit, true);
        }        
    });
    unit.endOfRound = unit.endOfRound.filter(t => t.duration > 0);
}

function updateTurnTempEffects(unit : Unit) {
    applyTempEffects(unit.endOfTurn.effects, unit, true);
    unit.endOfTurn.effects = {};
}

export function checkandSetCurrentUnit(gs : GameState, unit : Unit) : boolean {
    if (gs.battle.currentUnit && gs.battle.currentUnit !== unit.id) {
        console.log("this is not the active unit");
        return false;
    }
    gs.battle.currentUnit = unit.id;
    return true;
}