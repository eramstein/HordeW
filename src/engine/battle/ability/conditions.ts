import { GameState } from "../../game";
import { Unit, TerrainSpecs, TerrainType } from "../model";
import { TERRAIN_SPECS, getAdjacentPositions } from "../board";

export const ConditionTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, ...any) => boolean } = {
    isEnnemy: (paramUnitProperty : string) => {
        return (gs : GameState, unit : Unit, params : {}) => {
            return !(unit.owner === params[paramUnitProperty].owner);
        };
    },
    isMe: (paramUnitProperty : string) => {
        return (gs : GameState, unit : Unit, params : {}) => {
            return unit.id === params[paramUnitProperty].id;
        };
    },
    isOnTerrainType: (paramUnitProperty : string, terrainType : TerrainType) => {          
        return (gs : GameState, unit : Unit, params : {}) => {
            const t = paramUnitProperty ? params[paramUnitProperty] : unit;
            const tile = gs.battle.tiles[t.position.x][t.position.y];
            return tile.terrain === terrainType;
        };
    },
    isAdjacentAlly: (paramUnitProperty : string) => {          
        return (gs : GameState, unit : Unit, params : {}) => {
            const t = params[paramUnitProperty].position;
            const adjacenPositions = getAdjacentPositions(unit.position);            
            let found = false;
            adjacenPositions.forEach(p => {
                if (p.x === t.x && p.y === t.y) {
                    found = true;
                }
            });
            return found;
        };
    },
}