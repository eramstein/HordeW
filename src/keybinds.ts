import { get } from "svelte/store";
import { resetState, saveState, State, printState, tempTest, passUnit } from "./stores";
import { executeConsoleContents } from "./console";

export function handleKeyPress(event) {
    const state = get(State);

    // ENTER -> trigger console
    if (state.ui.console.open) { 
        if (event.charCode === 13) {
            executeConsoleContents();
        }
        return;
    }

    switch(event.charCode) {        

        case 99: // c -> console
        State.toggleConsole();
        break;
        
        case 115: // s -> save
        saveState("");
        break;

        case 108: // l -> log state
        printState();
        break;

        case 116: // t -> temp test
        tempTest();
        break;

        case 114: // r -> reset
        resetState();
        break;

        case 38: // 1 -> ability select // TODO: that's on my keyboard...
        State.selectAbility(0);
        break;
        case 61:
        State.selectAbility(1);
        break;
        case 34:
        State.selectAbility(2);
        break;
        case 39:
        State.selectAbility(3);
        break;
        case 40:
        State.selectAbility(4);
        break;

        case 32: // space -> pass unit
        event.preventDefault();
        passUnit();
        break;
        
        default: return;
    }

    event.preventDefault();

}
