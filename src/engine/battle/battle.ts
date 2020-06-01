import { BattleState, Tile, Faction, Unit, BattleOutcome, BattleStage } from "./model";
import { MAP_BROCELIANDE } from "../../data/maps/broceliande";
import { makeUnit } from "./unit";
import { GameState } from "../game";

export function initBattleState() : BattleState {
    const playerRoster = [];
    playerRoster.push(makeUnit("bears", 0, null));
    playerRoster.push(makeUnit("bears", 0, null));
    playerRoster.push(makeUnit("caravan", 0, null));
    const aiRoster = [];
    aiRoster.push(makeUnit("goblins", 1, { x: 5, y: 3 }));
    aiRoster.push(makeUnit("goblins", 1, { x: 6, y: 3 }));
    aiRoster.push(makeUnit("goblins", 1, { x: 7, y: 3 }));
    const initFactions : Faction[] = [
        { name: "La Horde", isPlayer: true, bench: playerRoster },
        { name: "Les Bestiaux", isPlayer: false, bench: [] },
    ];
    return {
        stage: BattleStage.Deployment,
        tiles: <Tile[][]>MAP_BROCELIANDE,
        factions: initFactions,
        units: aiRoster,
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