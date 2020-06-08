import { GameState } from "../../game";
import { Unit } from "../model";

export const ConditionTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ...any) => boolean } = {
    damageOnMe: () => {
        return (gs : GameState, unit : Unit, damage : number, isCombatDamage : boolean, damagedUnit : Unit) => {
            return unit.id === damagedUnit.id;
        };
    },
    attackOnMe: () => {
        return (gs : GameState, unit : Unit, attacker : Unit, defender : Unit) => {
            return unit.id === defender.id;
        };
    },
    deathOfMe: () => {
        return (gs : GameState, unit : Unit, deadUnit : Unit) => {
            return unit.id === deadUnit.id;
        };
    },
    ennemyMove: () => {
        return (gs : GameState, unit : Unit, mover : Unit) => {
            return !(unit.owner === mover.owner);
        };
    },
}