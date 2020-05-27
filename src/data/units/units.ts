import { Unit, UnitType, UnitCategory } from "../../engine/battle/model";

export const UNITS : { [key : string] : Unit } = {
    "bears": {
        template: "bears",
        name: "Bears",
        category: UnitCategory.Beast,
        hpMax: 20,
        moraleInit: 6,    
        meleeAttack: 3,
        meleeDefense: 4,
        rangeDefense: 0,
        meleeDamage: { min: 4, max: 6 },
        armor: 2,    
        abilities: [],
        movement: 3,
    },
    "goblins": {
        template: "goblins",
        name: "Goblins",
        category: UnitCategory.Humanoid,
        hpMax: 7,
        moraleInit: 6,    
        meleeAttack: 2,
        meleeDefense: 2,
        rangeDefense: 0,
        meleeDamage: { min: 4, max: 6 },
        armor: 1,    
        abilities: [],
        movement: 3,
    }
}