import { BattleState, Tile, Faction, Unit, BattleOutcome, BattleStage, BossPersoType } from "./model";
import { MAP_BROCELIANDE } from "../../data/maps/broceliande";
import { makeUnit } from "./unit";

export function initBattleState() : BattleState {
    const playerRoster = [];
    playerRoster.push(makeUnit("coeurebene", 0, { x: 8, y: 13 }));
    playerRoster.push(makeUnit("bears", 0, { x: 5, y: 6 }));
    playerRoster.push(makeUnit("bears", 0, { x: 6, y: 7 }));
    playerRoster.push(makeUnit("caravan", 0, { x: 7, y: 17 }));
    playerRoster.push(makeUnit("caravan", 0, { x: 17, y: 17 }));

    const aiRoster = [];
    // aiRoster.push(makeUnit("spearman", 1, { x: 5, y: 4 }));
    // aiRoster.push(makeUnit("spearman", 1, { x: 6, y: 4 }));
    // aiRoster.push(makeUnit("spearman", 1, { x: 7, y: 4 }));
    //  aiRoster.push(makeUnit("spearman", 1, { x: 15, y: 5 }));
    aiRoster.push(makeUnit("swordman", 1, { x: 15, y: 4 }));
    // aiRoster.push(makeUnit("swordman", 1, { x: 16, y: 4 }));
    // aiRoster.push(makeUnit("swordman", 1, { x: 17, y: 5 }));
    // aiRoster.push(makeUnit("swordman", 1, { x: 18, y: 5 }));
    // aiRoster.push(makeUnit("archer", 1, { x: 5, y: 3 }));
    // aiRoster.push(makeUnit("archer", 1, { x: 6, y: 3 }));
    // aiRoster.push(makeUnit("archer", 1, { x: 15, y: 3 }));
    // aiRoster.push(makeUnit("archer", 1, { x: 16, y: 3 }));

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
        currentUnit: null,
    };
}