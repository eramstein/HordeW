import { Ability, TerrainType } from "../../engine/battle/model";
import { ACT, ENEMIES, BEFORE_I_MOVE, MYSELF, UNITS, TILES, END_OF_ROUND } from "./shortcuts";
import { EffectTemplates as ET, mergeEffects } from "../../engine/battle/ability/effects";

export const DataAbilityTemplates : { [key:string]:(AbilityParams, ...any) => Ability } = {
    directDamage: (p, { damage = 1, count = 1, range = 1 }) => {
        return {
            text: "PING " + damage,
            visualEffect: "Bzzt",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.damage(damage),
            ...p,
        };
    },
    zoneDamage: (p, { damage = 1, count = 1, range = 1, radius = 1 }) => {
        return {
            text: "BOOM " + damage,
            visualEffect: "Boom",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.damageZone(damage, radius),
            ...p,
        };
    },
    heal: (p, { value = 1, count = 1, range = 1 }) => {
        return {
            text: "HEAL " + value,
            visualEffect: "Pchhhh",
            trigger: ACT,
            target: UNITS({ count, range }),
            effect: ET.heal(value),
            ...p,
        };
    },
    regeneration: (p, { value = 1 }) => {
        return {
            text: "Regeneration " + value,
            visualEffect: "Pchhhh",
            trigger: END_OF_ROUND,
            target: MYSELF,
            effect: ET.heal(value),
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
    mezzZone: (p, { value, radius, range }) => {
        return {
            text: "Mezz Zone " + value,
            visualEffect: "Spell",
            trigger: ACT,
            target: ENEMIES({ count: 1, range }),
            effect: ET.mezzZone(value, radius),
            ...p,
        };
    },
    root: (p, { value, count, range }) => {
        return {
            text: "Root " + value,
            visualEffect: "Spell",
            trigger: ACT,
            target: ENEMIES({ count, range }),
            effect: ET.root(value),
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
    updateTerrain: (p, { terrain, count, range }) => {
        return {
            text: "Transform into " + terrain,
            visualEffect: "Abracadabra",
            trigger: ACT,
            target: TILES({ count, range }),
            effect: ET.updateTerrain(terrain),
            ...p,
        };
    },
    addAbility: (p, { count, range, abilityName, duration }) => {
        return {
            text: "Add " + abilityName,
            trigger: ACT,
            target: UNITS({ count, range }),
            effect: ET.addAbility(abilityName, duration),
            ...p,
        };
    },
    tempEffect: (p, { count = 1, duration = 1, range, effect, endOfTurn = false, radius }) => {
        return {
            text: JSON.stringify(effect),
            trigger: ACT,
            target: UNITS({ count, range }),
            effect: ET.temporaryEffect({ effects: effect, duration }, endOfTurn, radius),
            ...p,
        };
    },
    summon: (p, { count, range, template }) => {
        return {
            text: "Summon " + count + " " + template,
            trigger: ACT,
            target: TILES({ count, range }),
            effect: ET.summon(template),
            ...p,
        };
    },
    transormTilesIntoUnit: (p, { count, range, terrainType, template }) => {
        return {
            text: "Tranform " + terrainType + " into " + template,
            trigger: ACT,
            target: TILES({ count, range, terrainType }),
            effect: mergeEffects([ET.summon(template), ET.updateTerrain(TerrainType.Plains)]) ,
            ...p,
        };
    },
}