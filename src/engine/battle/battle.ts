import { BattleState, Tile, Faction, Unit, BattleOutcome, BattleStage, BossPersoType } from "./model";
import { MAP_BROCELIANDE } from "../../data/maps/broceliande";
import { makeUnit } from "./unit";
import { GameState } from "../game";

export function initBattleState() : BattleState {
    const playerRoster = [];
    playerRoster.push(makeUnit("bears", 0, { x: 5, y: 13 }));
    playerRoster.push(makeUnit("bears", 0, { x: 6, y: 13 }));
    playerRoster.push(makeUnit("caravan", 0, { x: 7, y: 13 }));
    const aiRoster = [];
    aiRoster.push(makeUnit("goblins", 1, { x: 5, y: 10 }));
    aiRoster.push(makeUnit("goblins", 1, { x: 6, y: 10 }));
    aiRoster.push(makeUnit("goblins", 1, { x: 7, y: 10 }));
    const initFactions : Faction[] = [
        { name: "La Horde", isPlayer: true, bench: playerRoster },
        { name: "Les Bestiaux", isPlayer: false, bench: [], perso: BossPersoType.Random },
    ];
    return {
        stage: BattleStage.Battle,
        tiles: <Tile[][]>MAP_BROCELIANDE,
        factions: initFactions,
        units: aiRoster.concat(playerRoster),
        graveyard: [],
        currentFaction: 0,
        round: 1,
        log: [],
        tempLog: [],
    };
}