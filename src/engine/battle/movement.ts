import { Pos, Unit, LogType, TriggerType } from "./model";
import { GameState } from "../game";
import { nextTurn, checkandSetCurrentUnit } from "./turn";
import { addLog } from "./log";
import { getReachablePositions, checkIfUnitExhausted, destroyUnit } from "./unit";
import { getAdjacentPositions, getDistance } from "./board";
import { attack } from "./combat";
import { triggerAbilities } from "./ability/listeners";

export function moveUnit(gs: GameState, unit: Unit, pos: Pos) {

    if (checkandSetCurrentUnit(gs, unit) === false) {
        console.log("not the active unit - movement");
        return;
    }

    const validPos = getReachablePositions(gs, unit).filter(p => p.x === pos.x && p.y === pos.y);
    if (validPos.length === 0) {
        console.log("invalid pos");
        return;
    }

    triggerOpportunityAttacks(gs, unit);

    triggerAbilities(gs, TriggerType.BeforeMove, { mover: unit });

    applyMove(unit, pos);   

    addLog(gs, {
        type: LogType.Move,
        entity: unit,
        target: pos,
        text: `${unit.name} moved to ${pos.x}.${pos.y}`,
    });

    checkIfUnitExhausted(gs, unit);
}

export function triggerOpportunityAttacks(gs: GameState, unit: Unit) {
    gs.battle.units
        .filter(u => u.owner !== unit.owner && getDistance(u.position, unit.position) === 1 && !u.defender)
        .forEach(u => {
            attack(gs, u, unit, true);
        });
}

function applyMove(unit: Unit, pos: Pos) {
    unit.position = pos;
    unit.movesCount++;
}