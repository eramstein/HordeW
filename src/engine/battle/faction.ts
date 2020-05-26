import { GameState } from "../game";
import { Unit } from "./model";
import { canUnitMove, canUnitAttack } from "./unit";

export function getActiveUnits(gs : GameState, faction : number) : Unit[] {    
    return gs.battle.units.filter(unit => {
        return unit.owner === faction &&
            (canUnitMove(gs, unit));
            //(canUnitMove(gs, unit) || canUnitAttack(gs, unit));
    });
}