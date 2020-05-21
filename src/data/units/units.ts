import { Unit, UnitType, UnitCategory } from "../../engine/battle/model";

export const UNITS : { [key : string] : Unit } = {
    "bears": {
        name: "Bears",
        category: UnitCategory.Beast,
        hpMax: 12,
        moraleInit: 6,    
        meleeAttack: 2,
        meleeDefense: 4,
        rangeDefense: 0,
        meleeDamage: { min: 4, max: 6 },
        armor: 2,    
        abilities: [],
        movement: 3,
    }
}