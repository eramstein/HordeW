import { Ability } from "../../engine/battle/model";
import { ACT, ENEMIES, BEFORE_I_MOVE, MYSELF, UNITS } from "./shortcuts";
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
    zoneDamage: (p, { damage, range, count, radius }) => {
        count = count || 1;
        damage = damage || 1;
        range = range || 1;
        radius = radius || 1;
        return {
            text: "BOOM +" + damage,
            visualEffect: "Boom",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.damageZone(damage, radius),
            ...p,
        };
    },
    mezz: (p, { value, count, range }) => {
        return {
            text: "Mezz " + value,
            visualEffect: "Spell",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.mezz(value),
            ...p,
        };
    },
    furied: (p, { damage }) => {
        return {
            text: "Dmg on move " + damage,
            visualEffect: "Ouch",
            trigger: BEFORE_I_MOVE,
            target: MYSELF,
            effect: ET.damage(damage),
            ...p,
        };
    },
    addAbility: (p, { count, range, abilityName }) => {
        return {
            text: "Add " + abilityName,
            trigger: ACT,
            target: UNITS({ count, range }),
            effect: ET.addAbility(abilityName),
            ...p,
        };
    },
}