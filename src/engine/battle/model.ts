import { GameState } from "../game";

export interface BattleState {
    outcome?: BattleOutcome,
    stage: BattleStage,
    tiles: Tile[][],
    factions: Faction[],
    units: Unit[],
    graveyard: Unit[],
    currentFaction: number,
    currentUnit: string,
    round: number,
    log: Log[];
    tempLog: Log[];
    combatModifiers: CombatModifiers;
}

export enum BattleStage {
    Deployment = "DEPLOYMENT",
    Battle = "BATTLE",
}

export interface CombatModifiers {
    defender? : Unit;
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
    Vegetal = "VEGETAL",
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

export enum UnitSize {
    Large = "LARGE",
}

export interface Unit {
    // state
    id?: string,
    owner?: number,
    hp?: number,
    energy?: number,
    position?: Pos,
    used?: boolean,
    movesCount?: number,
    attacksCount?: number,
    endOfRound?: TemporaryEffects[],
    endOfTurn?: TemporaryEffects,
    cc?: CrowdControl,
    // template
    template: string,
    name: string,
    category: UnitCategory,
    type?: UnitType,
    hpMax: number,
    armor?: number,    
    abilities: Ability[],
    movement: number,
    meleeDefense: number,
    rangeDefense: number,
    meleeAttack: number,
    meleeDamage: Damage,
    range?: number,
    rangeAttack?: number,
    rangeDamage?: Damage,
    energyMax?: number,
    size?: UnitSize,
    // special optional stuff
    surviveCondition?: boolean, // lose if all destroyed
    loseCondition?: boolean,  // lose if any destroyed    
    passive?: boolean, // auto-skip even if not used
    defender?: boolean, // can't attack
    terrains?: { [key in TerrainType]?: boolean }, // terrain types it can move through for 1
    // ai stuff
    ai?: UnitAi,
    aiValue?: number, // how much the AI values killing it - computed by default based on stats, this is for special cases
}

export interface UnitAi {
    perso: UnitAiPerso,
}

export enum UnitAiPerso {
    Random = "RANDOM",
    Zombie = "ZOMBIE",
    Raider = "RAIDER",
    Hunter = "HUNTER",
    Survivor = "SURVIVOR",
}

export interface TemporaryEffects {
    duration: number,
    effects: TemporaryAttributes,    
}

export interface TemporaryAttributes {
    range?: number,
    rangeAttack?: number,
    rangeDefense?: number,
    meleeAttack?: number,
    meleeDefense?: number,
    movement?: number,
    meleeDamage?: number,
    rangeDamage?: number,
    armor?: number,
}

export interface CrowdControl {
    mezz: number,
    stun: number,
    root: number,
}

export interface Damage {
    min: number,
    max: number,
    fire?: boolean,
    magic?: boolean,
}

export interface Faction {
    isPlayer: boolean,
    name: string,
    bench: Unit[],
    perso?: BossPersoType,
}

export enum BossPersoType {
    Random = "RANDOM",
}

export enum LogType {
    Attack = "ATTACK",
    Move = "MOVE",
    Pass = "PASS",
    Ability = "ABILITY",
    Damage = "DAMAGE",
    RoundEnd = "ROUND_END",
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

export interface Ability {    
    name: string,
    text: string,
    effect(gs : GameState, unit : Unit, targetUnits : Unit[], targetPositions : Pos[], params? : {}): void,
    trigger: Trigger,
    target?: Target,
    cost?: number,
    exhausts?: boolean,
    template?: string,
    visualEffect?: string,
    duration?: number,
}

export interface Trigger {    
    type: TriggerType,
    condition?(gs : GameState, unit : Unit, params : {}): boolean,
}

export interface Target {    
    type: TargetType,
    count?: number,
    range?: number,
    eligible?(gs : GameState, unit : Unit, ability : Ability): Unit[] | Pos[],
}

export enum TriggerType {
    Activated = "ACTIVATED",    
    BeforeDamage = "BEFORE_DAMAGE",
    BeforeCombat = "BEFORE_COMBAT",
    AfterCombat = "AFTER_COMBAT",
    BeforeMove = "BEFORE_MOVE",
    AfterDeath = "AFTER_DEATH",
    OnSummon = "ON_SUMMON",
    EndOfRound = "END_OF_ROUND",
}

export enum TargetType {
    Unit = "UNIT",
    Self = "SELF",
    Tile = "TILE",
}

export interface AbilityParams { 
    name : string,
    cost?: number,
    target?: Target,
    trigger?: Trigger,
    fast?: boolean,
}