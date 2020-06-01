import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { onClickTile, onClickUnit, onClickRightTile, onClickRightUnit, unselect } from "./ui/game/battle/map";
import { nextTurn } from "./engine/battle/turn";
import { passUnitTurn } from "./engine/battle/unit";
import { sendAction, ActionType } from "./ui/game/battle/actions";
import { onClickBenchUnit, onClickEndDeployment } from "./ui/game/battle/bench";
import { finishDeployment, DEPLOYMENT_RANGE } from "./engine/battle/deployment";
import { MAP_SIZE } from "./engine/battle/board";

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

        setGameState: (gs) => update(s => { s.game = gs; return s; }),

        setTools: (tools) => update(s => { s.ui.tools = { ...s.ui.tools, ...tools }; return s; }),

        onClickTile: (x, y) => update(s => { onClickTile(s, x, y); return s; }),
        onClickRightTile: (x, y) => update(s => { onClickRightTile(s, x, y); return s; }),
        onClickUnit: (unit) => update(s => { onClickUnit(s, unit); return s; }),
        onClickRightUnit: (unit) => update(s => { onClickRightUnit(s, unit); return s; }),

        onClickBenchUnit: (unit) => update(s => { onClickBenchUnit(s, unit); return s; }),
        onClickEndDeployment: () => update(s => { onClickEndDeployment(s); return s; }),

        passUnitTurn: (unit) => update(s => { passUnitTurn(s.game, unit); unselect(s); return s; }),
        passTurn: () => update(s => { nextTurn(s.game); return s; }),
        unselect: () => update(s => { unselect(s); return s; }),
    };
}

function getNewState(): FullState {
    return {
        game: initGameState(),
        ui: initUiState(),
    };
}

function initUiState() {
    const init = {
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
    };
    // highlight deployment tiles
    for (let y = MAP_SIZE - DEPLOYMENT_RANGE; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            console.log(x, y);
            
            init.highlighted.tiles[x + "." + y] = true;
        }
    }    
    return init;
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

export function passUnit() {
    const state = get(State);
    sendAction(state.game, ActionType.Pass, {
        unit: state.game.battle.units.filter(u => u.id === state.ui.selected.unit.id)[0], 
    });
    State.unselect();
}

window.onbeforeunload = () => {
    //saveState();
};

window.onkeypress = handleKeyPress;
