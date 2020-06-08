import { Ability } from "../../engine/battle/model";
import { DataAbilityTemplates as AT } from "./abilityTemplates";

export const DataAbilities : { [key:string]:Ability } = {
    magicMissile: AT.directDamage({ name: 'Magic Missile' }, { damage : 2, range : 3 }),
}
