import { GameState } from "../../game";
import { TriggerType, Unit, Pos } from "../model";
import { getEligibleTargets } from "./ability";

function triggerAbilities(gs : GameState, type : TriggerType, ...rest) {
    gs.battle.units.forEach(u => {
        u.abilities.forEach(a => {
            if (a.trigger.type === type) {                
                if (!a.trigger.condition || a.trigger.condition(gs, u, ...rest)) {
                    // TODO: if a.target, ask player or AI for targets
                    // (store ability in a "pendingTriggeredAbilities" array ?)
                    console.log(u.name + " triggers " + a.name, a, ...rest);
                    let targets = null;
                    let params : any = {};                    
                    if (a.target) {
                        targets = getEligibleTargets(gs, u, a);
                    }                    
                    if (type === TriggerType.AfterCombat) {
                        params.attacker = rest[0];                        
                    }
                    if (type === TriggerType.BeforeMove) {
                        params.mover = rest[0];                        
                    }
                    a.effect(gs, u, targets, params);
                }
            }
        });
    });
}

export function onDamageUnit(gs : GameState, unit : Unit, damage : number, isCombatDamage : boolean) {
    triggerAbilities(gs, TriggerType.BeforeDamage, damage, isCombatDamage, unit);
}

export function onCombatResolution(gs : GameState, attacker : Unit, defender : Unit) {
    triggerAbilities(gs, TriggerType.AfterCombat, attacker, defender);
}

export function onMoveUnit(gs : GameState, unit : Unit, pos : Pos) {
    triggerAbilities(gs, TriggerType.BeforeMove, unit, pos);
}

export function onSummonUnit(gs : GameState, unit : Unit, pos : Pos, owned : boolean) {
    triggerAbilities(gs, TriggerType.OnSummon, unit, pos);
}

export function onUnitDeath(gs : GameState, unit : Unit) {
    triggerAbilities(gs, TriggerType.AfterDeath, unit);
}