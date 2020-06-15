import { GameState } from "../../game";
import { pickFrom } from "../../../utils/random";
import { getActiveUnits } from "../faction";
import { BossPersoType, Unit } from "../model";

export function selectUnit(gs : GameState) : Unit {
    let unit;    
    const perso = gs.battle.factions[gs.battle.currentFaction].perso;
    const activeUnits = getActiveUnits(gs, gs.battle.currentFaction);
    
    switch (perso) {
        case BossPersoType.Random:
            unit = selectUnitRandom(gs, activeUnits);
            break;
    
        default:
            console.log("selectUnit - perso not found", perso);
            break;
    }
    console.log('SELECTED UNIT: ', activeUnits.length, unit);
    
    return unit;
}

function selectUnitRandom(gs : GameState, activeUnits : Unit[]) : Unit {
    return pickFrom(activeUnits, 1)[0];
}