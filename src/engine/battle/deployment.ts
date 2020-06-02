import { GameState } from "../game";
import { Unit, Pos, BattleStage } from "./model";
import { MAP_SIZE } from "./board";

export const DEPLOYMENT_RANGE = 5;

export function deployUnit(gs : GameState, unit : Unit, pos : Pos) {
    
    if (unit.owner === 0 && pos.y < MAP_SIZE - DEPLOYMENT_RANGE) {
        console.log("invalid deployment position");
        return;
    }

    unit.position = pos;
    gs.battle.units.push(unit);
    gs.battle.factions[unit.owner].bench = gs.battle.factions[unit.owner].bench.filter(u => u.id !== unit.id);
}

export function finishDeployment(gs : GameState) {
    gs.battle.stage = BattleStage.Battle;
}