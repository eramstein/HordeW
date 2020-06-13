<script>
    import { State } from '../../../stores';
    import { sendAction, ActionType } from "./actions";
    import { TriggerType } from "../../../engine/battle/model";

    export let unit;

    const HP_BAR_SIZE = 100;

    $: owner = $State.game.battle.factions[unit.owner];
    $: selectedAbilityName = $State.ui.selected.ability && $State.ui.selected.ability.name;

    $: activatedAbilities = unit.abilities.filter(a => a.trigger.type === TriggerType.Activated);
    $: passiveAbilities = unit.abilities.filter(a => a.trigger.type !== TriggerType.Activated || !a.trigger.type);

    let hpBars = [];
    let energyBars = [];
    $: {
        hpBars = [];
        for (let i = 0; i < unit.hp; i++) {
            hpBars.push('full');            
        }
        for (let i = Math.max(0, unit.hp); i < unit.hpMax; i++) {
            hpBars.push('empty');            
        }        
        energyBars = [];
        for (let i = 0; i < unit.energy; i++) {
            energyBars.push('full');            
        }
        for (let i = Math.max(0, unit.energy); i < unit.energyMax; i++) {
            energyBars.push('empty');            
        }        
    }

    $: hpColor = unit.owner === 0 ? 'green' : '#ce0e0e';

    function onClickPass() {
        sendAction($State.game, ActionType.Pass, {
            unit: $State.game.battle.units.filter(u => u.id === unit.id)[0], 
        });
        State.unselect();
    }

    function getBuffColor(unit, buffType) {
        const value = (unit.endOfTurn[buffType] || 0) + (unit.endOfRound[buffType] || 0);        
        return value === 0 ? null :
            (value > 0 ? 'green' : 'red');
    }

</script>

<style>
    .unit-card {
        width: 100%;
    }
    .name {
        font-weight: bold;
    }
    .categories {
        text-transform: capitalize;
    }
    .stats {
        margin-bottom: 10px;
    }
    td {
        padding-right: 20px;
        vertical-align: top;   
    }
    .block-end td {
        padding-bottom: 10px;
    }
    .ability-active {
        border-top: 1px solid #ccc;
        padding: 10px 20px;
        width: 80%;
        text-align: center;
        cursor: pointer;
    }
     .ability-active:hover {
         background-color: #fafafa;
     }
    .ability-passive {
        border-top: 1px solid #ccc;
        padding: 10px 0px;
        text-align: center;
        background-color: #fdfdfd;
        color: #666;
    }
    .ability-name {
        font-weight: bold;
        margin-bottom: 5px;
    }
    .pass-button {
        border-top: 1px solid #ccc;
        padding-top: 20px;
        text-align: center;
    }
    svg {
        margin-top: 3px;
    }
    .hp, .energy {
        stroke: white;
        stroke-width: 0.5;
    }
    .muted {
        color: #999;
    }
    .sml {
        font-size: 14px !important;
    }
    .icon img {
        width: 20px;
        height: 20px;
    }
    .icon span {
        font-size: 24px;
    }
    .pad-right {
        padding-right: 10px;
    }
    .no-pad {
        padding: 0;
    }
</style>

<div class="unit-card">
    <div class="name">
        { unit.name }
    </div>
    <div class="categories">
        { unit.category.toLowerCase() } { unit.type && unit.type.toLowerCase() || '' } - { owner.name }
    </div>
    <div class="stats">
        <table>
            <tbody>
                <tr class="block-end">
                    <td class="icon">
                        {#if unit.cc.mezz}
                        <img src="assets/icons/mezz.png" alt="" /> <span class="pad-right">{ unit.cc.mezz }</span>
                        {/if}
                        {#if unit.cc.stun}
                        <img src="assets/icons/stun.png" alt="" /> <span class="pad-right">{ unit.cc.stun }</span>
                        {/if}
                        {#if unit.cc.root}
                        <img src="assets/icons/root.png" alt="" /> <span>{ unit.cc.root }</span>
                        {/if}
                    </td>
                    <td></td>
                </tr>
                <tr>                    
                    <td>                    
                        <svg height="20" width="{HP_BAR_SIZE}px">
                        {#each hpBars as hpBar,i}
                            <rect
                                class="hp"
                                x={HP_BAR_SIZE/hpBars.length*i}
                                y={0}
                                width="{HP_BAR_SIZE/hpBars.length}px"
                                height="20px"
                                style="fill:{hpBar === 'full' ? hpColor : '#ddd'}"
                            />
                        {/each}
                        </svg>               
                    </td>
                    <td>{ unit.hp } <span class="muted">/ { unit.hpMax }</span></td>
                </tr>
                {#if unit.energy !== undefined}
                <tr class="block-end">                    
                    <td>                    
                        <svg height="20" width="{HP_BAR_SIZE}px">
                        {#each energyBars as energyBar,i}
                            <rect
                                class="energy"
                                x={HP_BAR_SIZE/energyBars.length*i}
                                y={0}
                                width="{HP_BAR_SIZE/energyBars.length}px"
                                height="20px"
                                style="fill:{energyBar === 'full' ? 'rgb(255, 179, 84)' : '#ddd'}"
                            />
                        {/each}
                        </svg>               
                    </td>
                    <td>{ unit.energy } <span class="muted">/ { unit.energyMax }</span></td>
                </tr>
                {/if}
                <tr class="block-end">
                    <td class="icon">
                        <img src="assets/icons/move.png" alt="" /> <span class="pad-right">{ unit.movement }</span>
                        <img src="assets/icons/armor.png" alt="" /> <span>{ unit.armor }</span>
                    </td>
                    <td></td>
                </tr>
                <tr class="block-end">
                    <td class="icon no-pad" colspan="2">
                        <img src="assets/icons/sword.png" alt="" />
                        <span style="color:{ getBuffColor(unit, 'meleeAttack') }">{ unit.meleeAttack } </span>
                        <span class="sml muted pad-right">ATK</span>
                        <span style="color:{ getBuffColor(unit, 'meleeDefense') }">{ unit.meleeDefense } </span>
                        <span class="sml muted pad-right">DEF</span>
                        <span style="color:{ getBuffColor(unit, 'meleeDamage') }">{ unit.meleeDamage.min }-{ unit.meleeDamage.max } </span>
                        <span class="sml muted">DMG</span>
                    </td>
                    <td></td>
                </tr>
                <tr class="block-end">
                    <td class="icon no-pad" colspan="2">
                        <img src="assets/icons/bow.png" alt="" />
                        {#if unit.range}
                        <span style="color:{ getBuffColor(unit, 'rangeAttack') }">{ unit.rangeAttack } </span>
                        <span class="sml muted pad-right">ATK</span>
                        {/if}
                        <span style="color:{ getBuffColor(unit, 'rangeDefense') }">{ unit.rangeDefense } </span>
                        <span class="sml muted pad-right">DEF</span>
                        {#if unit.range}
                        <span style="color:{ getBuffColor(unit, 'rangeDamage') }">{ unit.rangeDamage.min }-{ unit.rangeDamage.max } </span>
                        <span class="sml muted">DMG</span>
                        {/if}
                    </td>
                    <td></td>
                </tr>                
            </tbody>
        </table>
    </div>
    {#each activatedAbilities as ability}
        <div class="ability-active"
            style="background-color:{ ability.name === selectedAbilityName ? 'rgb(255, 179, 84)' : null }"
            on:click={() => State.onClickAbility(ability)}
        >
            <div class="ability-name">{ ability.name }</div>
            <div class="ability-text">{ ability.text }</div>
        </div>
    {/each}
    {#each passiveAbilities as ability}
        <div class="ability-passive">
            <div class="ability-name">{ ability.name }</div>
            <div class="ability-text">{ ability.text }</div>
        </div>
    {/each}    
    {#if unit.owner === 0}
    <div class="pass-button">
        <button on:click={onClickPass}>PASS</button>
    </div>
    {/if}
</div>

