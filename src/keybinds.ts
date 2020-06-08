import { resetState, saveState, State, printState, tempTest, passUnit } from "./stores";

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

        case 38: // 1 -> ability select // TODO: that's on my keyboard...
        State.selectAbility(0);
        break;

        case 32: // space -> pass unit
        event.preventDefault();
        passUnit();
        break;
        
        default: return;
    }

    event.preventDefault();

}
