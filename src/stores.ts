import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { onClickTile, onClickUnit } from "./ui/game/battle/map";
import { nextTurn } from "./engine/battle/turn";

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
        onClickUnit: (index) => update(s => { onClickUnit(s, index); return s; }),

        passTurn: () => update(s => { nextTurn(s.game); return s; }),
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
            highlighted: {},
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
