import { GameState } from "../../game";
import { Unit, Ability, Pos } from "../model";
import { getDistance, getPositionsInRangeRange } from "../board";

export const TargetEligibilityTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ability : Ability) => Unit[] | Pos[] } = {
    enemiesCloserThan: (n) => {
        return (gs : GameState, unit : Unit, ability : Ability) => {
            return gs.battle.units.filter(u => {
                return u.owner !== unit.owner &&
                    getDistance(unit.position, u.position) <= n;
            });
        };
    },
    unitsCloserThan: (n) => {
        return (gs : GameState, unit : Unit, ability : Ability) => {
            return gs.battle.units.filter(u => {
                return getDistance(unit.position, u.position) <= n;
            });
        };
    },
    tilesCloserThan: (n) => {
        return (gs : GameState, unit : Unit, ability : Ability) => {            
            return getPositionsInRangeRange(unit.position, n, 1);
        };
    },
}