import { FullState } from "../../model";
import { Unit } from "../../../engine/battle/model";
import { finishDeployment } from "../../../engine/battle/deployment";

export function onClickBenchUnit(state : FullState, clickedUnit : Unit) {
    const isUnit = state.ui.selected.benchUnit && state.ui.selected.benchUnit.id === clickedUnit.id;
    if (isUnit) {
        state.ui.selected.benchUnit = null;
    } else {
        state.ui.selected.benchUnit = clickedUnit;
    }    
}

export function onClickEndDeployment(state : FullState) {
    state.ui.highlighted.tiles = {};
    finishDeployment(state.game);  
}