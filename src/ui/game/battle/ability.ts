import { FullState } from "../../model";
import { Ability, TargetType } from "../../../engine/battle/model";
import { getEligibleTargetUnits, getEligibleTargetTiles } from "../../../engine/battle/ability/ability";

export function onClickAbility(state : FullState, clickedAbility : Ability) {
    
    if (!clickedAbility) {
        return;
    }

    const isAbility = state.ui.selected.ability && state.ui.selected.ability.name === clickedAbility.name;
    if (isAbility) {
        state.ui.selected.ability = null;
        state.ui.highlighted.abilityTargettableUnits = {};
        state.ui.highlighted.abilityTargettablePositions = {};
        state.ui.selected.abilityTargettedUnits = {};
        state.ui.selected.abilityTargettedPositions = {};
        return;
    }

    state.ui.selected.ability = clickedAbility;

    // HIGHLIGHT ELIGIBLE TARGETS
    if (clickedAbility.target && clickedAbility.target.type === TargetType.Unit) {
        const eligibleTargetUnits = getEligibleTargetUnits(state.game, state.ui.selected.unit, clickedAbility);    
        eligibleTargetUnits.forEach(u => {
            state.ui.highlighted.abilityTargettableUnits[u.id] = true;
        });
    }
    if (clickedAbility.target && clickedAbility.target.type === TargetType.Tile) {
        const eligibleTargetTiles = getEligibleTargetTiles(state.game, state.ui.selected.unit, clickedAbility);    
        eligibleTargetTiles.forEach(u => {
            state.ui.highlighted.abilityTargettablePositions[u.x + "." + u.y] = true;
        });
    }
}
