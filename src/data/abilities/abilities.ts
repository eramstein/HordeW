import { Ability } from "../../engine/battle/model";
import { DataAbilityTemplates as AT } from "./abilityTemplates";

export const DataAbilities : { [key:string]:Ability } = {
    magicMissile: AT.directDamage({ name: 'Magic Missile', cost: 1 }, { damage : 2, range : 3 }),
    multiMissile: AT.directDamage({ name: 'Multi Missile', cost: 2 }, { damage : 2, range : 3, count : 3 }),
}
