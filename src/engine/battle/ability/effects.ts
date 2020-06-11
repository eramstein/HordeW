import { GameState } from "../../game";
import { Unit, Pos, TemporaryEffects } from "../model";
import { damageUnit, healUnit, mezzUnit, stunUnit } from "../unit";
import { getDistance } from "../board";

export const EffectTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[], params : any) => void } = {
    damage: (damage : number) => {
        return (gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[]) => {            
            if (!targetUnits) { return }
            targetUnits.forEach(t => {
                damageUnit(gs, t, damage);                
            });
        };
    },
    damageZone: (damage : number, radius : number) => {
        return (gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[]) => {            
            if (!targetUnits) { return }
            targetUnits.forEach(t => {
                gs.battle.units
                    .filter(u => getDistance(u.position, t.position) <= radius)
                    .forEach(u => {
                        damageUnit(gs, u, damage);
                    });                                
            });
        };
    },
    // damageAttacker: (damage : number) => {
    //     return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[], params : { attacker : Unit }) => {
    //         if (!params || !params.attacker) { return }
    //         damageUnit(gs, params.attacker, damage, false);
    //     };
    // },
    // damageMover: (damage : number) => {
    //     return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[], params : { mover : Unit }) => {
    //         if (!params || !params.mover) { return }
    //         damageUnit(gs, params.mover, damage, false);
    //     };
    // },
    heal: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                healUnit(gs, t, value);
            });
        };
    },
    mezz: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                mezzUnit(gs, t, value);
            });
        };
    },
    stun: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                stunUnit(gs, t, value);
            });
        };
    },
    temporaryEffect: (effect : TemporaryEffects, endOfTurn : boolean) => {
        function mergeEffects(current : TemporaryEffects, added : TemporaryEffects) : TemporaryEffects {
            return {
                meleeAttack: (current.meleeAttack || 0) + (added.meleeAttack || 0),
                damageShield: (current.damageShield || 0) + (added.damageShield || 0),
                dot: (current.dot || 0) + (added.dot || 0),
                hot: (current.hot || 0) + (added.hot || 0),
            }
        }
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            if (!targets || targets.length === 0) { return }                       
            targets.forEach(t => {                
                if (effect.meleeAttack) {
                    t.meleeAttack += effect.meleeAttack;
                }
                if (endOfTurn) {
                    t.endOfTurn = mergeEffects(t.endOfTurn, effect);
                } else {
                    t.endOfRound = mergeEffects(t.endOfRound, effect);
                }
            });            
        };
    },
}