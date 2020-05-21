import { GameState } from "../../game";
import { OpenAction, OpenActionType, ActionType, AiLogType } from "./ai";
import { pickFrom } from "../../../utils/random";
import { getTemplate, playCard, CardType } from "../card";
import { Unit, canUnitAttack, moveUnit } from "../unit";
import { Tower } from "../tower";
import { getEmptyPosInRegion, getEmptyPosCountInRegion, getBlocker } from "../board";
import { attackTower, combat } from "../combat";

export function playAiRoundRandom(gs : GameState, actions : OpenAction[]) {
    const action = pickFrom(actions, 1)[0];    

    if (action.type === OpenActionType.PlayCard) {
        useCard(gs, action);
    }

    if (action.type === OpenActionType.Unit) {
        useUnit(gs, action);
    }

}

function useCard(gs : GameState, action : OpenAction) {
    const card = gs.battle.foe.hand[action.entity];
    const template = getTemplate(card);
    const tower = getTower(gs, template.cost);

    if (tower === null) {
        console.log("no suitable tower found", gs, action);        
        return;
    }

    if (card.type === CardType.Unit) {
        const emptyPositions = getEmptyPosInRegion(gs, tower.pos, false);
        if (emptyPositions.length === 0) {
            console.log("no emptyPosition found", gs, tower);        
            return;
        }
        playCard(gs, action.entity, pickFrom(emptyPositions, 1)[0]);
    }

}

function useUnit(gs : GameState, action : OpenAction) {
    const unit : Unit = action.entity;
    const emptyPositions = getEmptyPosInRegion(gs, unit.pos.region, false);
    const canMove = emptyPositions.length > 0;
    const canAttack = canUnitAttack(gs, unit);
    const actionType = canMove ?
        canAttack ? attackOrMove() : ActionType.Move
        :
        canAttack ? ActionType.Attack : null;

    if (!actionType) {
        console.log("Unit can't do anything, exhaust it", gs, unit);
        unit.exhausted = true;
        return;
    }

    if (actionType === ActionType.Move) {
        const destination = pickFrom(emptyPositions, 1)[0];
        moveUnit(gs, unit, destination);
    }

    if (actionType === ActionType.Attack) {
        const blocker = getBlocker(gs, unit);
        if (blocker) {
            console.log(unit, "attacks", blocker);
            gs.battle.aiLog.push({ type: AiLogType.AttackUnit, entity: unit, target: blocker });
            combat(gs, unit, blocker);
        } else {
            console.log(unit, "attacks tower");
            const tower = gs.battle.player.towers[unit.pos.region];
            gs.battle.aiLog.push({ type: AiLogType.AttackTower, entity: unit, target: tower });
            attackTower(gs, unit, tower);
        }
    }

}

function getTower(gs : GameState, cost : number) : Tower {    
    const towers = gs.battle.foe.towers.filter(t => t.gold >= cost && getEmptyPosCountInRegion(gs, t.pos, false) > 0);
    if (towers.length > 0) {
        return pickFrom(towers, 1)[0];
    }
    return null;
}

function attackOrMove() : ActionType {
    const option = pickFrom([ActionType.Move, ActionType.Attack, ActionType.Attack], 1)[0];
    return option;
}