import { Ability, Unit, TargetType, Pos, LogType, TriggerType } from "../model";
import { GameState } from "../../game";
import { nextTurn, checkandSetCurrentUnit } from "../turn";
import { addLog } from "../log";
import { checkIfUnitExhausted } from "../unit";

export function newAbility(template : Ability) : Ability {    
    return {
        ...template,
    }
}

export function playAbility(gs : GameState, unit : Unit, ability : Ability, targetUnits : Unit[], targetPositions : Pos[]) {
    const targetsString = (targetUnits && targetUnits.map(t => t.name).join(", ")) + (targetPositions && targetPositions.map(t => t.x + "." + t.y).join(", "));
    console.log(unit.name + " uses " + ability.name + " on " + targetsString);
    
    // CHECKS + COSTS
    // ----------------------------------------------------------------------
    if (ability.trigger.type === TriggerType.Activated) {
        if (checkandSetCurrentUnit(gs, unit) === false) {
            return;
        }        
    }
    
    if (ccPreventsAbility(gs, unit)) {
        return;
    }

    if (payAbilityCost(gs, unit, ability) === false) {
        return;
    }

    if (allTargetUnitsEligible(gs, unit, ability, targetUnits) === false) {
        return;
    }

    if (allTargetPositionsEligible(gs, unit, ability, targetPositions) === false) {
        return;
    }
    
    if (ability.target && ability.target.type === TargetType.Self) {
        targetUnits = [unit];
    }

    // EFFECT
    // ----------------------------------------------------------------------
    ability.effect(gs, unit, targetUnits, targetPositions, {});

    // LOG
    // ----------------------------------------------------------------------
    addLog(gs, {
        type: LogType.Ability,
        entity: { ...unit },
        data: { name: ability.visualEffect || ability.name },
        text: `${unit.name} used ${ability.name} on ${targetsString}`,
    });
    
}

function ccPreventsAbility(gs : GameState, unit : Unit) : boolean {
    if (unit && (unit.cc.mezz > 0 || unit.cc.stun > 0)) {
        console.log("Mezzed or Stunned - skip ability");
        return true;
    }
    return false;
}

function payAbilityCost(gs : GameState, unit : Unit, ability : Ability) : boolean {
    const cost = ability.cost || 0;
    if (!unit.energy || unit.energy < cost) {
        console.log("NOT ENOUGH ENERGY");
        return false;
    }

    unit.energy -= cost;
    
    if (ability.exhausts) {    
        unit.used = true;
    } else {
        checkIfUnitExhausted(gs, unit);
    }
    
    return true;
}

function allTargetUnitsEligible(gs : GameState, unit : Unit, ability : Ability, targets : Unit[]) : boolean {
    if (ability.target && ability.target.type === TargetType.Unit) {    
        const eligibleTargets = getEligibleTargetUnits(gs, unit, ability);        
        const targetsValid = checkTargetUnitsEligibility(targets, eligibleTargets);    
        if (targetsValid === false) {
            console.log("INVALID TARGET", ability, targets);
            return false;
        }
        return true;
    }
    return true;
}

function allTargetPositionsEligible(gs : GameState, unit : Unit, ability : Ability, targets : Pos[]) : boolean {
    if (ability.target && ability.target.type === TargetType.Tile) {    
        const eligibleTargets = getEligibleTargetTiles(gs, unit, ability);        
        const targetsValid = checkTargetPositionsEligibility(targets, eligibleTargets);    
        if (targetsValid === false) {
            console.log("INVALID TARGET", ability, targets);
            return false;
        }
        return true;
    }
    return true;
}

export function getEligibleTargetUnits(gs : GameState, unit : Unit, ability : Ability) : Unit[] {    
    if (!ability.target || ability.target.type === TargetType.Tile) {
        return null;
    }
    if (ability.target && ability.target.type === TargetType.Self) {
        return [unit];
    }
    if (!ability.target.eligible) {
        // TODO
    }    
    return <Unit[]>ability.target.eligible(gs, unit, ability);
}

export function getEligibleTargetTiles(gs : GameState, unit : Unit, ability : Ability) : Pos[] {    
    if (!ability.target || ability.target.type !== TargetType.Tile) {
        return null;
    }
    return <Pos[]>ability.target.eligible(gs, unit, ability);
}

export function checkTargetUnitsEligibility(targets : Unit[], eligible : Unit[]) : boolean {
    if (eligible === null) {
        return true;
    }
    const eligibleMap = eligible.reduce((agg, unit) => {
        agg[unit.id] = true;
        return agg;
    }, {});
    let allGood = true;
    targets.forEach(target => {
        if (!eligibleMap[target.id]) {
            allGood = false;
        }
    });
    return allGood;
}

export function checkTargetPositionsEligibility(targets : Pos[], eligible : Pos[]) : boolean {
    if (eligible === null) {
        return true;
    }
    const eligibleMap = eligible.reduce((agg, pos) => {
        agg[pos.x + "." + pos.y] = true;
        return agg;
    }, {});
    let allGood = true;
    targets.forEach(target => {
        if (!eligibleMap[target.x + "." + target.y]) {
            allGood = false;
        }
    });
    return allGood;
}