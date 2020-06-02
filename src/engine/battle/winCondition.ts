import { GameState } from "../game";
import { Unit, BattleOutcome } from "./model";

export function checkWinStateOnUnitDestruction(gs : GameState, unit : Unit) {
    let outcome = null;
    const myUnit = unit.owner === 0;
    if (unit.loseCondition) {
        outcome = myUnit ? BattleOutcome.Lose : BattleOutcome.Win;
    }
    if (unit.surviveCondition) {
        const otherUnits = gs.battle.units.filter(u => u.owner === unit.owner && u.surviveCondition);
        if (otherUnits.length === 0) {
            outcome = myUnit ? BattleOutcome.Lose : BattleOutcome.Win;
        }        
    }
    if (outcome !== null) {
        setWinState(gs, outcome);
    }    
}

export function setWinState(gs : GameState, outcome : BattleOutcome) {
    gs.battle.outcome = outcome;
}