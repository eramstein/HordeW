import { GameState } from "../engine/game";
import { TerrainType, Unit } from "../engine/battle/model";

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
    };
    highlighted: {
        tiles?: {},
    };
}

export interface Tools {
    terrainEditor: boolean;
    terrainType: TerrainType;
}

