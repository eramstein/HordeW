import { Unit, UnitType, UnitCategory, UnitAiPerso } from "../../engine/battle/model";
import { DataAbilities as AB } from "../abilities/abilities";

export const UNITS : { [key : string] : Unit } = {
    "caravan": {
        template: "caravan",
        name: "Caravan",
        category: UnitCategory.Human,
        hpMax: 5,
        energyMax: 0,    
        meleeAttack: 0,
        meleeDefense: 0,
        rangeDefense: 0,
        meleeDamage: { min: 0, max: 0 },
        armor: 5,    
        abilities: [],
        movement: 0,
        surviveCondition: true,
        passive: true,
        defender: true,
    },
    "bears": {
        template: "bears",
        name: "Bears",
        category: UnitCategory.Beast,
        hpMax: 20,
        energyMax: 6,    
        meleeAttack: 30,
        meleeDefense: 4,
        rangeDefense: 0,
        meleeDamage: { min: 2, max: 3 },
        armor: 2,    
        abilities: [AB.magicMissile, AB.multiMissile],
        movement: 3,
        range: 3,
        rangeAttack: 3,
        rangeDamage: { min: 4, max: 6 },        
    },
    "goblins": {
        template: "goblins",
        name: "Goblins",
        category: UnitCategory.Humanoid,
        hpMax: 7,   
        meleeAttack: 2,
        meleeDefense: 2,
        rangeDefense: 0,
        meleeDamage: { min: 4, max: 6 },
        armor: 1,    
        abilities: [],
        movement: 3,
        range: 3,
        rangeAttack: 3,
        rangeDamage: { min: 4, max: 6 },
        ai: {
            perso: UnitAiPerso.Raider,
        },        
    }
}