import { GameState } from "../../game";
import { Unit, UnitAiPerso } from "../model";
import { nextTurn } from "../turn";
import { selectUnit } from "./unitSelection";
import { useUnitRandom } from "./useUnitRandom";
import { useUnitZombie } from "./useUnitZombie";

export enum AiActionType {
    Attack = "ATTACK",
    Move = "MOVE",
}

export function playAiTurn(gs : GameState) {    
    const activeUnit = selectUnit(gs);
    if (activeUnit) {
        useUnit(gs, activeUnit);
    } else {
        nextTurn(gs);
    }
}

function useUnit(gs : GameState, unit : Unit) {

    switch(unit.ai.perso) {        
        
        case UnitAiPerso.Random:
            useUnitRandom(gs, unit);
        break;

        case UnitAiPerso.Zombie:
            useUnitZombie(gs, unit);
        break;
        
        default:
            console.log("useUnit - perso not found", unit.ai.perso);
        break;
    }
    
}