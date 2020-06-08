import { GameState } from "../../game";
import { Unit, Ability, Pos } from "../model";
import { getDistance } from "../board";

export const TargetEligibilityTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ability : Ability) => Unit[] | Pos[] } = {
    distanceLowerThan: (n) => {
        return (gs : GameState, unit : Unit, ability : Ability) => {
            return gs.battle.units.filter(u => {
                return getDistance(unit.position, u.position) <= n;
            });
        };
    },
    enemiesCloserThan: (n) => {
        return (gs : GameState, unit : Unit, ability : Ability) => {
            return gs.battle.units.filter(u => {
                return u.owner !== unit.owner &&
                    getDistance(unit.position, u.position) <= n;
            });
        };
    },
}