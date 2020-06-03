import { GameState } from "../../game";
import { Unit, UnitAiPerso } from "../model";
import { nextTurn } from "../turn";
import { selectUnit } from "./unitSelection";
import { useUnitRandom } from "./useUnitRandom";
import { useUnitZombie } from "./useUnitZombie";
import { useUnitRaider } from "./useUnitRaider";

// how much the unit values...
export interface AiPersoPrefs {
    survival: number; // its own survival
    kill: number; // killing enemy units
    wincon: number; // going after win conditions
    help: number; // helping allied units
}

export enum AiActionType {
    Attack = "ATTACK",
    Move = "MOVE",
}

export function playAiTurn(gs : GameState) {
    const t0 = performance.now();

    const activeUnit = selectUnit(gs);
    if (activeUnit) {
        useUnit(gs, activeUnit);
    } else {
        nextTurn(gs);
    }

    const t1 = performance.now();
    console.log(`playAiTurn - ${t1 - t0} ms`);
}

function useUnit(gs : GameState, unit : Unit) {

    switch(unit.ai.perso) {        
        
        case UnitAiPerso.Random:
            useUnitRandom(gs, unit);
        break;

        case UnitAiPerso.Zombie:
            useUnitZombie(gs, unit);
        break;

        case UnitAiPerso.Raider:
            useUnitRaider(gs, unit);
        break;
        
        default:
            console.log("useUnit - perso not found", unit.ai.perso);
        break;
    }
    
}