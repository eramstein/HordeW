import { Ability } from "../../engine/battle/model";
import { ACT, ENEMIES } from "./shortcuts";
import { EffectTemplates as ET } from "../../engine/battle/ability/effects";

export const DataAbilityTemplates : { [key:string]:(AbilityParams, ...any) => Ability } = {
    directDamage: (p, { damage, range, count }) => {
        count = count || 1;
        damage = damage || 1;
        range = range || 1;
        return {            
            text: "PING +" + damage,
            visualEffect: "Bzzt",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.damage(damage),
            ...p,
        };
    },
}