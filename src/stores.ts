import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { onClickTile, onClickUnit, onClickRightTile, onClickRightUnit, unselect } from "./ui/game/battle/map";
import { nextTurn } from "./engine/battle/turn";
import { passUnitTurn } from "./engine/battle/unit";

export const State = createFullState();

function createFullState() {
    const initialState = loadState();

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        update,
        set,
        initialize: () => set(getNewState()),
        load: data => set(data),
        tempTest: () => update(s => { return s; }),

        setTools: (tools) => update(s => { s.ui.tools = { ...s.ui.tools, ...tools }; return s; }),

        onClickTile: (x, y) => update(s => { onClickTile(s, x, y); return s; }),
        onClickRightTile: (x, y) => update(s => { onClickRightTile(s, x, y); return s; }),
        onClickUnit: (unit) => update(s => { onClickUnit(s, unit); return s; }),
        onClickRightUnit: (unit) => update(s => { onClickRightUnit(s, unit); return s; }),

        passUnitTurn: (unit) => update(s => { passUnitTurn(s.game, unit); return s; }),
        passTurn: () => update(s => { nextTurn(s.game); return s; }),
        unselect: () => update(s => { unselect(s); return s; }),
    };
}

function getNewState(): FullState {
    return {
        game: initGameState(),
        ui: {
            openScreen: Screen.Battle,
            screenParameters: null,
            tools: {
                terrainEditor: true,
                terrainType: null,
            },
            selected: {},
            highlighted: {
                meleeAttackableUnits: {},
                rangeAttackableUnits: {},
                tiles: {},
            },
        },
    };
}

export function loadState(): FullState {
    const savedData = localStorage.getItem("hordewar") || "nope"
    if (!savedData || savedData === "undefined" || savedData === "nope") {
      return getNewState()
    } else {
      const parsedData = JSON.parse(savedData)
      return parsedData
    }
}
  
export function saveState() {
    const savedData = get(State);
    localStorage.setItem("hordewar", JSON.stringify(savedData))
}

export function printState() {
    console.log(get(State));
}

export function resetState() {
    State.initialize();
    saveState();
}

export function tempTest() {
    State.tempTest();
}

window.onbeforeunload = () => {
    //saveState();
};

window.onkeypress = handleKeyPress;
