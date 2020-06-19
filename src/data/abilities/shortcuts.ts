import { TriggerType, TargetType, TerrainType } from "../../engine/battle/model";
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
    condition: ConditionTemplates.isMe('damagedUnit'),
};

export const BEFORE_I_MOVE = {
    type: TriggerType.BeforeMove,
    condition: ConditionTemplates.isMe('mover'),
};

export const BEFORE_ENEMY_MOVE = {
    type: TriggerType.BeforeMove,
    condition: ConditionTemplates.isEnnemy('mover'),
};

export const AFTER_ATTACKED_ME = {
    type: TriggerType.AfterCombat,
    condition: ConditionTemplates.isMe('defender'),
};

export const AFTER_DEATH_OF_ME = {
    type: TriggerType.AfterDeath,
    condition: ConditionTemplates.isMe('deadUnit'),
};

// Targets
//-------------------------------------------------

export const MYSELF = {
    type: TargetType.Self,
};

export function TILES({ range, count, terrainType = null }) {
    return {
        type: TargetType.Tile,
        count: count,
        eligible: TargetEligibilityTemplates.tilesCloserThan(range, terrainType),
    };    
};

export function ENEMIES({ range, count }) {
    return {
        type: TargetType.Unit,
        count: count,
        eligible: TargetEligibilityTemplates.enemiesCloserThan(range),
    };    
};

export function UNITS({ range, count }) {
    return {
        type: TargetType.Unit,
        count: count,
        eligible: TargetEligibilityTemplates.unitsCloserThan(range),
    };    
};