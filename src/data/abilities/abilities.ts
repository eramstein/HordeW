import { Ability, TerrainType } from "../../engine/battle/model";
import { DataAbilityTemplates as AT } from "./abilityTemplates";

export const DataAbilities : { [key:string]: Ability } = {
    magicMissile: AT.directDamage({ name: 'Magic Missile', cost: 1 }, { damage : 2, range : 3 }),
    multiMissile: AT.directDamage({ name: 'Multi Missile', cost: 2 }, { damage : 2, range : 3, count : 3 }),
    fireball: AT.zoneDamage({ name: 'Fireball', cost: 2 }, { damage : 5, range : 3, count : 1, radius : 3 }),
    smallHeal: AT.heal({ name: 'Heal - small', cost: 2 }, { value : 3, range : 3 }),
    regeneration: AT.regeneration({ name: 'Regeneration' }, { value : 3 }),
    hot: AT.addAbility({ name: 'HOT', cost: 2 }, { count : 1, range : 5, duration: 2, abilityName : 'regeneration' }),
    buffSpeed: AT.tempEffect({ name: 'Buff Movement', cost: 1 }, { range : 5, effect : { movement: 1 }, duration: 2 }),
    mezz: AT.mezz({ name: 'Mezz', cost: 2 }, { value : 3, range : 3, count : 1 }),
    mezzZone: AT.mezzZone({ name: 'Mezz Zone', cost: 4, exhausts: true }, { value : 2, range : 3, radius : 3 }),
    root: AT.root({ name: 'Root', cost: 2 }, { value : 5, range : 3, count : 1 }),
    furied: AT.furied({ name: 'Piquotage', cost: 1 }, { damage : 5 }),
    applyFuried: AT.addAbility({ name: 'Enfury', cost: 1 }, { count : 1, range : 5, abilityName : 'furied' }),
    buffAttack: AT.tempEffect({ name: 'Buff Attack', cost: 1 }, { count : 1, range : 5, effect : { meleeAttack: 3 }, duration: 2 }),
    makeForests: AT.updateTerrain({ name: 'Make Forests', cost: 1 }, { count : 3, range : 5, terrain: TerrainType.Forest }),
    summonShroom: AT.summon({ name: 'Summon mushroom', cost: 1 }, { count : 1, range : 5, template: 'mushroom' }),
    transformIntoEnt: AT.transormTilesIntoUnit({ name: 'Forest to ent', cost: 2, exhausts: true }, { count : 1, range : 5, template: 'treemen', terrainType: TerrainType.Forest }),
}