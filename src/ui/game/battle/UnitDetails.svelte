<script>
    import { State } from '../../../stores';
    import { sendAction, ActionType } from "./actions";
    import { TriggerType } from "../../../engine/battle/model";

    export let unit;

    $: owner = $State.game.battle.factions[unit.owner];
    $: selectedAbilityName = $State.ui.selected.ability && $State.ui.selected.ability.name;

    $: activatedAbilities = unit.abilities.filter(a => a.trigger.type === TriggerType.Activated);
    $: passiveAbilities = unit.abilities.filter(a => a.trigger.type !== TriggerType.Activated || !a.trigger.type);

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
        margin: 10px 0px;
    }
    td {
        padding-right: 20px;
    }
    .block-end td {
        padding-bottom: 10px;
    }
    .ability-active {
        border-top: 1px solid #ccc;
        padding: 10px 20px;
        width: 80%;
        text-align: center;
    }
    .ability-passive {
        border-top: 1px solid #ccc;
        padding: 10px 0px;
        text-align: center;
        background-color: #f1f1f1;
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
</style>

<div class="unit-card">
    <div class="name">
        { unit.name }
    </div>
    <div>
        { owner.name }
    </div>
    <div class="categories">
        { unit.category.toLowerCase() } { unit.type && unit.type.toLowerCase() || '' }
    </div>
    <div class="stats">
        <table>
            <tbody>
                <tr>
                    <td>Hit Points</td>
                    <td>{ unit.hp } / { unit.hpMax }</td>
                </tr>
                {#if unit.energy !== undefined}
                <tr class="block-end">
                    <td>Energy</td>
                    <td>{ unit.energy } / { unit.energyMax }</td>
                </tr>
                {/if}
                <tr class="block-end">
                    <td>Movement</td>
                    <td>{ unit.movement }</td>
                </tr>
                <tr class="block-end">
                    <td>Armor</td>
                    <td>{ unit.armor }</td>
                </tr>
                <tr>
                    <td>Melee Attack</td>
                    <td style="color:{ getBuffColor(unit, 'meleeAttack') }">{ unit.meleeAttack }</td>
                </tr>                
                <tr class="block-end">
                    <td>Melee Damage</td>
                    <td>{ unit.meleeDamage.min } to { unit.meleeDamage.max }</td>
                </tr>
                <tr>
                    <td>Melee Defense</td>
                    <td>{ unit.meleeDefense }</td>
                </tr>
                {#if unit.range}
                <tr>
                    <td>Range</td>
                    <td>{ unit.range }</td>
                </tr>
                <tr>
                    <td>Range Attack</td>
                    <td>{ unit.rangeAttack }</td>
                </tr>
                <tr>
                    <td>Range Damage</td>
                    <td>{ unit.rangeDamage.min } to { unit.rangeDamage.max }</td>
                </tr>
                {/if}
                <tr class="block-end">
                    <td>Range Defense</td>
                    <td>{ unit.rangeDefense }</td>
                </tr>
                {#if unit.cc.mezz}
                <tr>
                    <td>Mezz</td>
                    <td>{ unit.cc.mezz } rounds</td>
                </tr>
                {/if}
                {#if unit.cc.stund}
                <tr>
                    <td>Stunned</td>
                    <td>{ unit.cc.stund } rounds</td>
                </tr>
                {/if}
                {#if unit.cc.root}
                <tr>
                    <td>Rooted</td>
                    <td>{ unit.cc.root } rounds</td>
                </tr>
                {/if}
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
    <div class="pass-button">
        <button on:click={onClickPass}>PASS</button>
    </div>
</div>

