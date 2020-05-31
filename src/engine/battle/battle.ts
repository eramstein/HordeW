import { BattleState, Tile, Faction, Unit, BattleOutcome } from "./model";
import { MAP_BROCELIANDE } from "../../data/maps/broceliande";
import { makeUnit } from "./unit";
import { GameState } from "../game";

export function initBattleState() : BattleState {
    const initFactions : Faction[] = [
        { name: "La Horde", isPlayer: true },
        { name: "Les Bestiaux", isPlayer: false },
    ];
    const initUnits : Unit[] = [];
    for (let i = 0; i < 3; i++) {
        const unit = makeUnit("bears", 0, { x: 5 + i, y: 5 - i });        
        initUnits.push(unit);
    }
    for (let i = 0; i < 4; i++) {
        const unit = makeUnit("goblins", 1, { x: 5 + i, y: i });        
        initUnits.push(unit);
    }
    initUnits.push(makeUnit("goblins", 1, { x: 9, y: 3 }));
    initUnits.push(makeUnit("goblins", 1, { x: 5, y: 3 }));
    initUnits.push(makeUnit("goblins", 1, { x: 9, y: 1 }));
    initUnits.push(makeUnit("caravan", 0, { x: 9, y: 2 }));
    return {
        tiles: <Tile[][]>MAP_BROCELIANDE,
        factions: initFactions,
        units: initUnits,
        graveyard: [],
        currentFaction: 0,
        round: 1,
        log: [],
        tempLog: [],
    };
}

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