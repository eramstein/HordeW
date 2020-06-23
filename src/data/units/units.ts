import { Unit, UnitType, UnitCategory, UnitAiPerso, TerrainType } from "../../engine/battle/model";
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
    "spearman": {
        template: "spearman",
        name: "Spearman",
        category: UnitCategory.Humanoid,
        hpMax: 7,   
        meleeAttack: 20,
        meleeDefense: 4,
        rangeDefense: 0,
        meleeDamage: { min: 5, max: 5 },
        abilities: [],
        movement: 2,
        ai: { perso: UnitAiPerso.Raider },        
    },
    "swordman": {
        template: "swordman",
        name: "Swordman",
        category: UnitCategory.Humanoid,
        hpMax: 8,   
        meleeAttack: 8,
        meleeDefense: 3,
        rangeDefense: 0,
        meleeDamage: { min: 6, max: 8 },
        abilities: [],
        movement: 2,
        ai: { perso: UnitAiPerso.Hunter },        
    },
    "archer": {
        template: "archer",
        name: "Archer",
        category: UnitCategory.Humanoid,
        hpMax: 5,   
        meleeAttack: 1,
        meleeDefense: 1,
        rangeDefense: 0,
        meleeDamage: { min: 1, max: 2 },
        abilities: [],
        movement: 2,
        range: 3,
        rangeAttack: 3,
        rangeDamage: { min: 3, max: 3 },
        ai: { perso: UnitAiPerso.Hunter },        
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
        abilities: [AB.magicMissile, AB.buffAttack, AB.mezz, AB.applyFuried, AB.guard],
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
    },
    "mushroom": {
        template: "mushroom",
        name: "Shroom",
        category: UnitCategory.Vegetal,
        hpMax: 1,   
        meleeAttack: 1,
        meleeDefense: 1,
        rangeDefense: 0,
        meleeDamage: { min: 1, max: 1 },
        armor: 0,    
        abilities: [],
        movement: 0,
        range: 3,
        rangeAttack: 3,
        rangeDamage: { min: 2, max: 3 },
    },
    "treemen": {
        template: "treemen",
        name: "Ent",
        category: UnitCategory.Vegetal,
        hpMax: 12,   
        meleeAttack: 4,
        meleeDefense: 5,
        rangeDefense: 2,
        meleeDamage: { min: 7, max: 8 },
        armor: 3,    
        abilities: [],
        movement: 1,
    },
    "coeurebene": {
        template: "coeurebene",
        name: "Ambroise Cœur d’Ébène",
        category: UnitCategory.Humanoid,
        hpMax: 6,
        meleeAttack: 2,
        meleeDefense: 2,
        rangeDefense: 0,
        meleeDamage: { min: 3, max: 3 },
        abilities: [AB.root, AB.makeForests, AB.summonShroom, AB.transformIntoEnt],
        movement: 2,
        range: 3,
        rangeAttack: 4,
        rangeDamage: { min: 2, max: 3 },
        energyMax: 8,
        terrains: { [TerrainType.Forest] : true },
    },
    "capucine": {
        template: "capucine",
        name: "Capucine",
        category: UnitCategory.Humanoid,
        hpMax: 6,
        meleeAttack: 2,
        meleeDefense: 3,
        rangeDefense: 1,
        armor: 1,
        meleeDamage: { min: 3, max: 4 },
        abilities: [AB.mezz, AB.mezzZone, AB.smallHeal, AB.buffSpeed, AB.hot],
        movement: 3,
        energyMax: 8,
    },
    "dryad": {
        template: "dryad",
        name: "Dryad",
        category: UnitCategory.Vegetal,
        hpMax: 6,
        meleeAttack: 1,
        meleeDefense: 5,
        rangeDefense: 1,
        meleeDamage: { min: 5, max: 8 },
        abilities: [AB.autoHitForest],
        movement: 2,
        terrains: { [TerrainType.Forest] : true },
    },
}