import { GameState } from "../engine/game";
import { TerrainType, Unit, Ability } from "../engine/battle/model";
import { AiTileValue } from "../engine/battle/ai/model";

export interface FullState {
    game: GameState;
    ui: UI;
}

export enum Screen {
    Battle = "BATTLE",
}

export enum TooltipType {
    CombatPreview = "COMBAT_PREVIEW",
}

export interface UI {
    openScreen: Screen;
    screenParameters: any;
    console: {
        open: boolean,
        value: string,
    };
    tools: Tools;
    selected: {
        unit?: Unit,
        benchUnit?: Unit,
        ability?: Ability,
        abilityTargettedUnits: {},
        abilityTargettedPositions: {},
    };
    highlighted: {
        tiles: {},
        meleeAttackableUnits: {},
        rangeAttackableUnits: {},
        abilityTargettableUnits: {},
        abilityTargettablePositions: {},
    };
    tooltip: Tooltip;
    actionLabels: ActionLabel[];
    delayAnimationTime: number;
}

export interface Tools {
    terrainEditor: boolean;
    terrainType: TerrainType;
    aiTileValues: AiTileValue[][];
}

export interface Tooltip {
    position: { x: number, y: number };
    type: TooltipType;
    data: {};
}

export interface ActionLabel {
    color: string,
    text: string,
    unit: Unit,
    isPlayer: boolean,
}
