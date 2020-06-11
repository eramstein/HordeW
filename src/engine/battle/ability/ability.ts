import { Ability, Unit, TargetType, Pos, LogType } from "../model";
import { GameState } from "../../game";
import { nextTurn } from "../turn";
import { addLog } from "../log";
import { checkIfUnitExhausted } from "../unit";

export function newAbility(template : Ability) : Ability {
    return {
        ...template,
    }
}

export function playAbility(gs : GameState, unit : Unit, ability : Ability, targetUnits : Unit[], targetPositions : Pos[]) {
    console.log(unit.name + " uses " + ability.name + " on " + (targetUnits && targetUnits.map(t => t.name).join(", ")));
    
    // CHECKS + COSTS
    // ----------------------------------------------------------------------
    if (ccPreventsAbility(gs, unit)) {
        return;
    }

    if (payAbilityCost(gs, unit, ability) === false) {
        return;
    }

    if (allTargetUnitsEligible(gs, unit, ability, targetUnits) === false) {
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
        text: `${unit.name} used ${ability.name} on ${targetUnits && targetUnits.map(t => t.name).join(", ")}`,
    });

    // NEXT ROUND
    // ----------------------------------------------------------------------
    if (!ability.fast) {
        nextTurn(gs);
    }
    
}

function ccPreventsAbility(gs : GameState, unit : Unit) : boolean {
    // if (unit && (unit.cc.mezz > 0 || unit.cc.stun > 0 || unit.cc.dazed)) {
    //     console.log("Mezzed or Stunned or Dazed - skip ability");
    //     unit.cc.dazed = false;        
    //     return true;
    // }
    return false;
}

function payAbilityCost(gs : GameState, unit : Unit, ability : Ability) : boolean {
    const cost = ability.cost || 0;
    if (unit.energy < cost) {
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
    if (ability.target && ability.target.type !== TargetType.Self) {    
        const eligibleTargets = getEligibleTargetUnits(gs, unit, ability);        
        const targetsValid = checkEligibility(targets, eligibleTargets);    
        if (targetsValid === false) {
            console.log("INVALID TARGET", ability, targets);
            return false;
        }
        return true;
    }
    return true;
}

export function getEligibleTargetUnits(gs : GameState, unit : Unit, ability : Ability) : Unit[] {    
    if (!ability.target) {
        return null;
    }
    if (ability.target && ability.target.type === TargetType.Self) {
        return [unit];
    }
    if (!ability.target.eligible) {
        // TODO
    }    
    return ability.target.eligible(gs, unit, ability);
}

export function checkEligibility(targets : Unit[], eligible : Unit[]) : boolean {
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