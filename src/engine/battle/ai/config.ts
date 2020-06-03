import { AiPersoPrefs } from "./ai";
import { UnitAiPerso } from "../model";

export const UNIT_PREFS : { [key in UnitAiPerso] : AiPersoPrefs }  = {
    [UnitAiPerso.Random]: {
        survival: 1,
        kill: 1,
        wincon: 1,
        help: 1,
    },
    [UnitAiPerso.Zombie]: {
        survival: 1,
        kill: 1,
        wincon: 1,
        help: 1,
    },
    [UnitAiPerso.Raider]: {
        survival: 1,
        kill: 0,
        wincon: 1,
        help: 0,
    },
    [UnitAiPerso.Hunter]: {
        survival: 0.1,
        kill: 1,
        wincon: 0,
        help: 0,
    },
    [UnitAiPerso.Survivor]: {
        survival: 1,
        kill: 0,
        wincon: 0,
        help: 0,
    },
}