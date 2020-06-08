import { FullState } from "../../model";
import { Ability } from "../../../engine/battle/model";
import { getEligibleTargetUnits } from "../../../engine/battle/ability/ability";

export function onClickAbility(state : FullState, clickedAbility : Ability) {    
    const isAbility = state.ui.selected.ability && state.ui.selected.ability.name === clickedAbility.name;
    if (isAbility) {
        state.ui.selected.ability = null;
        return;
    }

    state.ui.selected.ability = clickedAbility;

    // HIGHLIGHT ELIGIBLE TARGETS
    const eligibleTargets = getEligibleTargetUnits(state.game, state.ui.selected.unit, clickedAbility);            
    eligibleTargets.forEach(u => {
        state.ui.highlighted.abilityTargettableUnits[u.id] = true;
    });

}
