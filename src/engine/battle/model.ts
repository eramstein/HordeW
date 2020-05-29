export interface BattleState {
    tiles: Tile[][],
    factions: Faction[],
    units: Unit[],
    graveyard: Unit[],
    currentFaction: number,
    round: number,
    log: Log[];
    aiLog: Log[];
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
    id?: string,
    owner?: number,
    hp?: number,
    morale?: number,
    position?: Pos,
    used?: boolean,
    movesCount?: number,
    attacksCount?: number,
    // template
    template: string,
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
    // ai stuff
    ai?: UnitAi,
}

export interface UnitAi {
    moveOrder: number,
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

export enum LogType {
    Attack = "ATTACK",
    Move = "MOVE",
}

export enum LogResult {
    Hit = "HIT",
    Miss = "MISS",
}

export interface Log {
    type: LogType,
    entity?: any,
    target?: any,
    result?: any,
    data?: any,
    text?: any,
}