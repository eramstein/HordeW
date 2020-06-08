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

export interface UI {
    openScreen: Screen;
    screenParameters: any;
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
}

export interface Tools {
    terrainEditor: boolean;
    terrainType: TerrainType;
    aiTileValues: AiTileValue[][],
}

