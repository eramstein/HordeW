import { TriggerType, TargetType } from "../../engine/battle/model";
import { ConditionTemplates } from "../../engine/battle/ability/conditions";
import { TargetEligibilityTemplates } from "../../engine/battle/ability/targets";

// Trigerrs
//-------------------------------------------------
export const ACT = {
    type: TriggerType.Activated,
};

export const BEFORE_DAMAGE = {
    type: TriggerType.BeforeDamage,
};

export const BEFORE_DAMAGE_ME = {
    type: TriggerType.BeforeDamage,
    condition: ConditionTemplates.damageOnMe(),
};

export const BEFORE_ENEMY_MOVE = {
    type: TriggerType.BeforeMove,
    condition: ConditionTemplates.ennemyMove(),
};

export const AFTER_ATTACKED_ME = {
    type: TriggerType.AfterCombat,
    condition: ConditionTemplates.attackOnMe(),
};

export const AFTER_DEATH_OF_ME = {
    type: TriggerType.AfterDeath,
    condition: ConditionTemplates.deathOfMe(),
};

// Targets
//-------------------------------------------------

export const MYSELF = {
    type: TargetType.Self,
};

export function ENEMIES({ range, count }) {
    return {
        type: TargetType.Unit,
        count: count,
        eligible: TargetEligibilityTemplates.enemiesCloserThan(range),
    };    
};