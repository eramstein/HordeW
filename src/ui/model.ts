import { GameState } from "../engine/game";
import { TerrainType } from "../engine/battle/model";

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
}

export interface Tools {
    terrainEditor: boolean;
    terrainType: TerrainType;
}

