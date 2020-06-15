import { get } from "svelte/store";
import { State, saveState, loadState } from "./stores";

export function executeConsoleContents() {
    const state = get(State);

    if (!state.ui.console.value || state.ui.console.value === '') {
        State.toggleConsole();
    }

    const bits = state.ui.console.value.split(' ');

    switch(bits[0]) {        

        case "s": // s -> save
        saveState(bits[1]);
        break;

        case "l": // l -> save
        State.set(loadState(bits[1]));
        break;
        
        default: return;
    }

    state.ui.console.value = "";
    State.toggleConsole();

}