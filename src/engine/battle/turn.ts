import { GameState } from "../game";
import { Unit } from "./model";
import { damageUnit, healUnit, canUnitDoAnything } from "./unit";

export function nextTurn(gs : GameState) {
    console.log("next turn");

    resetTurnEffects(gs);

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
    gs.battle.units.forEach(u => { updateTempEffects(u, true) });
    gs.battle.units.forEach(u => { updateCC(u) });
}

function resetTurnEffects(gs : GameState) {
    gs.battle.units.forEach(u => { updateTempEffects(u, false) });    
}

function applyRoundEffects(gs : GameState) {
    gs.battle.units.forEach(u => {
        decrementAbilitiesDuration(u);
        if (u.endOfRound.dot) {
            damageUnit(gs, u, u.endOfRound.dot);
        }
        if (u.endOfRound.hot) {
            healUnit(gs, u, u.endOfRound.hot);
        }
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

function updateTempEffects(unit : Unit, endOfRound : boolean) {
    const effects = endOfRound ? unit.endOfRound : unit.endOfTurn;
    if (effects.meleeAttack !== 0) {
        unit.meleeAttack -= effects.meleeAttack;
    }
    effects.meleeAttack = 0;
    effects.damageShield = 0;
}