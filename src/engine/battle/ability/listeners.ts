import { GameState } from "../../game";
import { TriggerType, Unit, Pos } from "../model";
import { getEligibleTargetUnits } from "./ability";

export function triggerAbilities(gs : GameState, type : TriggerType, params : {}) {
    // TODO: register/unregister unit/ability to TriggerTypes, to avoid looping all abilities every time?
    gs.battle.units.forEach(u => {
        u.abilities.forEach(a => {
            if (a.trigger.type === type) {                
                if (!a.trigger.condition || a.trigger.condition(gs, u, params)) {
                    // TODO: if a.target, ask player or AI for targets
                    // (store ability in a "pendingTriggeredAbilities" array ?)
                    let targetUnits = null;
                    let targetPositions = null;
                    if (a.target) {
                        targetUnits = getEligibleTargetUnits(gs, u, a);
                    }
                    a.effect(gs, u, targetUnits, targetPositions, params);
                }
            }
        });
    });
}