import { GameState } from "../game";
import { Unit } from "./model";
import { getDistance } from "./board";
import { getRangeSkillDiff, getMeleeSkillDiff, getHitChance, getDamageFinalValue } from "./combat";

export interface DamageExpecation {
    hitChance: number,
    damageRange: {
        min: number,
        max: number,
    }
}

export function getAttackExpectation(gs : GameState, attacker : Unit, defender : Unit) : DamageExpecation {
    const isRange = !!(getDistance(attacker.position, defender.position) > 1);
    let skillDiff;
    let damageValue;
    if (isRange) {
        skillDiff = getRangeSkillDiff(attacker, defender);
        damageValue = attacker.rangeDamage;
    } else {
        skillDiff = getMeleeSkillDiff(attacker, defender);
        damageValue = attacker.meleeDamage;
    }
    const hitChance = getHitChance(skillDiff);
    const damageRange = {
        min: getDamageFinalValue(gs, attacker, defender, damageValue.min),
        max: getDamageFinalValue(gs, attacker, defender, damageValue.max),
    };
    return {
        hitChance,
        damageRange,
    };
}