import { initBattleState } from "./battle/battle";
import { BattleState } from "./battle/model";

export interface GameState {
    battle: BattleState,
}

export function initGameState(): GameState {

    const gameState: GameState = {
        battle: initBattleState(),
    };
    
    return gameState;
}
