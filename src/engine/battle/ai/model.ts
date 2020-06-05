// how much the unit values...
export interface AiPersoPrefs {
    survival: number; // its own survival
    kill: number; // killing enemy units
    wincon: number; // going after win conditions
    help: number; // helping allied units
}

export enum AiActionType {
    Attack = "ATTACK",
    Move = "MOVE",
}

export interface AiTileValue {
    threatTotal: number; // total expected damage it can take on this tile
    threatMax: number; // max expected damage it can take on this tile in one attack
    bounty: number; // highest attack value it can get from this tile
}