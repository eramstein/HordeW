export interface BattleState {
    tiles: Tile[][],
    factions: Faction[],
    units: Unit[],
    currentFaction: number,
    round: number,
}

export interface Tile {
    terrain: TerrainType,
}

export interface Pos {
    x: number,
    y: number,
}

export enum TerrainType {
    Plains = "PLAINS",
    Forest = "FOREST",
    Hills = "HILLS",
    Mountain = "MOUNTAIN",
    Water = "WATER",
    WaterShallow = "WATER_SHALLOW",
}

export interface TerrainSpecs {
    blocksVision?: boolean,
    blocksMovement?: boolean,
    movementCost: number,
    altitude?: number,
}

export enum UnitCategory {
    Human = "HUMAN",
    Beast = "BEAST",
    Humanoid = "HUMANOID",
}

export enum UnitType {
    Hero = "HERO",
    Monster = "MONSTER",
    Infantry = "INFANTRY",
    Cavalry = "CAVALRY",
    Horde = "HORDE",
    Artillery = "ARTILLERY",
    Chariot = "CHARIOT",
}

export interface Unit {
    // state
    owner?: number,
    destroyed?: boolean,
    hp?: number,
    morale?: number,
    position?: Pos,
    used?: boolean,
    movesCount?: number,
    attacksCount?: number,
    // template
    id: string,
    name: string,
    category: UnitCategory,
    type?: UnitType,
    hpMax: number,
    moraleInit: number,    
    meleeAttack: number,
    meleeDefense: number,
    rangeAttack?: number,
    rangeDefense: number,
    meleeDamage: Damage,
    rangeDamage?: Damage,
    range?: number,
    armor: number,    
    abilities: Ability[],
    movement: number,    
}

export interface Damage {
    min: number,
    max: number,
    fire?: boolean,
    magic?: boolean,
}

export interface Ability {
}

export interface Faction {
    isPlayer: boolean,
    name: string,
}