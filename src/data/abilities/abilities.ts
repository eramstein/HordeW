import { Ability } from "../../engine/battle/model";
import { DataAbilityTemplates as AT } from "./abilityTemplates";

export const DataAbilities : { [key:string]:Ability } = {
    magicMissile: AT.directDamage({ name: 'Magic Missile', cost: 1 }, { damage : 2, range : 3 }),
    multiMissile: AT.directDamage({ name: 'Multi Missile', cost: 2 }, { damage : 2, range : 3, count : 3 }),
    fireball: AT.zoneDamage({ name: 'Fireball', cost: 2 }, { damage : 5, range : 3, count : 1, radius : 3 }),
    mezz: AT.mezz({ name: 'Mezz', cost: 2 }, { value : 5, range : 3, count : 1 }),
    furied: AT.furied({ name: 'Piquotage', cost: 1 }, { damage : 5 }),
    applyFuried: AT.addAbility({ name: 'Enfury', cost: 1 }, { count : 1, range : 5, abilityName : 'furied' }),
    buffAttack: AT.tempEffect({ name: 'Buff Attack', cost: 1 }, { count : 1, range : 5, effect : { meleeAttack: 3 } }),
}