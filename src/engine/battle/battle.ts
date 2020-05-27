import { BattleState, Tile, Faction, Unit } from "./model";
import { MAP_BROCELIANDE } from "../../data/maps/broceliande";
import { makeUnit } from "./unit";

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
    return {
        tiles: <Tile[][]>MAP_BROCELIANDE,
        factions: initFactions,
        units: initUnits,
        graveyard: [],
        currentFaction: 0,
        round: 1,
        log: [],
    };
}