import { resetState, saveState, State, printState, tempTest, pass } from "./stores";

export function handleKeyPress(event) {    

    switch(event.charCode) {        
        
        case 115: // s -> save
        saveState();
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

        case 32: // space -> pass unit
        event.preventDefault();
        pass();
        break;
        
        default: return;
    }

    event.preventDefault();

}
