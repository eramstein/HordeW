import { GameState } from "../../game";
import { Unit } from "../model";

export const ConditionTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ...any) => boolean } = {
    isEnnemy: (paramUnitProperty : string) => {
        return (gs : GameState, unit : Unit, params : {}) => {
            return !(unit.owner === params[paramUnitProperty].owner);
        };
    },
    isMe: (paramUnitProperty : string) => {
        return (gs : GameState, unit : Unit, params : {}) => {
            return unit.id === params[paramUnitProperty].id;
        };
    },
}