export interface BattleState {
    outcome?: BattleOutcome,
    stage: BattleStage,
    tiles: Tile[][],
    factions: Faction[],
    units: Unit[],
    graveyard: Unit[],
    currentFaction: number,
    round: number,
    log: Log[];
    tempLog: Log[];
}

export enum BattleStage {
    Deployment = "DEPLOYMENT",
    Battle = "BATTLE",
}

export enum BattleOutcome {
    Win = "WIN",
    Lose = "LOSE",
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
    meleeDefense: number,    
    rangeDefense: number,
    meleeAttack: number,
    meleeDamage: Damage,
    range?: number,
    rangeAttack?: number,
    rangeDamage?: Damage,
    armor: number,    
    abilities: Ability[],
    movement: number,
    // special optional stuff
    surviveCondition?: boolean, // lose if all destroyed
    loseCondition?: boolean,  // lose if any destroyed
    defender?: boolean,
    passive?: boolean, // auto-skip even if not used
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
    bench: Unit[],
}

export enum LogType {
    Attack = "ATTACK",
    Move = "MOVE",
    Pass = "PASS",
}

export enum LogResult {
    Hit = "HIT",
    Miss = "MISS",
}

export interface Log {
    currentFaction?: number,
    type: LogType,
    entity?: any,
    target?: any,
    result?: any,
    data?: any,
    text?: any,
}