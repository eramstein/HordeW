import { GameState } from "../../game";
import { Unit, Pos, TemporaryEffects, Ability, TerrainType } from "../model";
import { damageUnit, healUnit, mezzUnit, stunUnit, rootUnit, makeUnit } from "../unit";
import { getDistance } from "../board";
import { newAbility } from "./ability";
import { DataAbilities } from "../../../data/abilities/abilities";

export type EffectFunction =
    (gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[], params : any) => void;

export function mergeEffects(effectsFunctions : EffectFunction[]) : EffectFunction {
    return (gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[], params : any) => {            
        effectsFunctions.forEach(f => {
            f(gs, unit, targetUnits, targetPositions, params);
        });
    };
}

export const EffectTemplates : { [key:string]: (...any) => EffectFunction } = {
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
    damageAttacker: (damage : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[], params : { attacker : Unit }) => {
            if (!params || !params.attacker) { return }
            damageUnit(gs, params.attacker, damage);
        };
    },
    damageMover: (damage : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[], params : { mover : Unit }) => {
            if (!params || !params.mover) { return }
            damageUnit(gs, params.mover, damage);
        };
    },
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
    root: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                rootUnit(gs, t, value);
            });
        };
    },
    updateTerrain: (terrain : TerrainType) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            targetPositions.forEach(pos => {
                gs.battle.tiles[pos.x][pos.y].terrain = terrain;
            });            
        };
    },
    addAbility: (abilityName : string, duration : number) => {        
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            const template = DataAbilities[abilityName];
            if (!targets) { return }
            targets.forEach(t => {
                const ability = newAbility(template);
                if (duration) {
                    ability.duration = duration;
                }
                t.abilities.push(ability);
            });
        };
    },
    summon: (unitTemplate : string, otherFaction : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], targetPositions : Pos[]) => {
            const faction = otherFaction === undefined ? unit.owner : otherFaction;
            targetPositions.forEach(pos => {
                const summonedUnit = makeUnit(unitTemplate, faction, pos);
                gs.battle.units.push(summonedUnit);
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