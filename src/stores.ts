import { get, writable } from "svelte/store";
import { GameState, initGameState } from "./engine/game";
import { handleKeyPress } from "./keybinds";
import { Screen, FullState } from "./ui/model";
import { onClickTile, onClickUnit, onClickRightTile, onClickRightUnit, unselect } from "./ui/game/battle/map";
import { nextTurn } from "./engine/battle/turn";
import { passUnitTurn, restoreUnitAbilities } from "./engine/battle/unit";
import { sendAction, ActionType } from "./ui/game/battle/actions";
import { onClickBenchUnit, onClickEndDeployment } from "./ui/game/battle/bench";
import { finishDeployment, DEPLOYMENT_RANGE } from "./engine/battle/deployment";
import { MAP_SIZE } from "./engine/battle/board";
import { onClickAbility } from "./ui/game/battle/ability";
import { TriggerType } from "./engine/battle/model";

export const State = createFullState();

function createFullState() {
    const initialState = loadState("");

    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        update,
        set,
        initialize: () => set(getNewState()),
        load: data => set(data),
        tempTest: () => update(s => { return s; }),
        toggleConsole: () => update(s => { s.ui.console.open = !s.ui.console.open; return s; }),

        setGameState: (gs) => update(s => { s.game = gs; return s; }),

        setTools: (tools) => update(s => { s.ui.tools = { ...s.ui.tools, ...tools }; return s; }),
        setTooltip: (tooltip) => update(s => { s.ui.tooltip = tooltip; return s; }),

        onClickTile: (x, y) => update(s => { onClickTile(s, x, y); return s; }),
        onClickRightTile: (x, y) => update(s => { onClickRightTile(s, x, y); return s; }),
        onClickUnit: (unit) => update(s => { onClickUnit(s, unit); return s; }),
        onClickRightUnit: (unit) => update(s => { onClickRightUnit(s, unit); return s; }),

        onClickAbility: (ability) => update(s => { onClickAbility(s, ability); return s; }),
        onClickBenchUnit: (unit) => update(s => { onClickBenchUnit(s, unit); return s; }),
        onClickEndDeployment: () => update(s => { onClickEndDeployment(s); return s; }),

        passUnitTurn: (unit) => update(s => { passUnitTurn(s.game, unit); unselect(s); return s; }),
        passTurn: () => update(s => { nextTurn(s.game); return s; }),
        unselect: () => update(s => { unselect(s); return s; }),
        selectAbility: (i) => update(s => { onClickAbility(s, s.ui.selected.unit.abilities.filter(a => a.trigger.type === TriggerType.Activated)[i]); return s; }),
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
        console: {
            open: false,
            value: '',
        },
        tools: {
            terrainEditor: true,
            terrainType: null,
            aiTileValues: null,
        },
        selected: {
            abilityTargettedUnits: {},
            abilityTargettedPositions: {},
        },
        highlighted: {
            meleeAttackableUnits: {},
            rangeAttackableUnits: {},
            abilityTargettableUnits: {},
            abilityTargettablePositions: {},
            tiles: {},
        },
        tooltip: null,
    };    
    // highlight deployment tiles
    // for (let y = MAP_SIZE - DEPLOYMENT_RANGE; y < MAP_SIZE; y++) {
    //     for (let x = 0; x < MAP_SIZE; x++) {            
    //         init.highlighted.tiles[x + "." + y] = true;
    //     }
    // }
    return init;
}

export function loadState(saveName : string): FullState {
    const savedData = localStorage.getItem("hordewar" + saveName) || "nope";    
    if (!savedData || savedData === "undefined" || savedData === "nope") {
      return getNewState();
    } else {
      const parsedData : FullState = JSON.parse(savedData);
      if (parsedData.ui.selected.unit) {
        const selectedUnit = parsedData.game.battle.units.filter(u => u.id === parsedData.ui.selected.unit.id)[0];        
        parsedData.ui.selected.unit = selectedUnit;        
      }
      parsedData.game.battle.units.forEach(u => { restoreUnitAbilities(u) });
      return parsedData;
    }
}
  
export function saveState(saveName : string) {
    const savedData = get(State);
    localStorage.setItem("hordewar" + saveName, JSON.stringify(savedData))
}

export function printState() {
    console.log(get(State));
}

export function resetState() {
    State.initialize();
    saveState("");
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
