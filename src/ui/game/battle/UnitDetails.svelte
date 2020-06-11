<script>
    import { State } from '../../../stores';
    import { sendAction, ActionType } from "./actions";

    export let unit;

    $: owner = $State.game.battle.factions[unit.owner];
    $: selectedAbilityName = $State.ui.selected.ability && $State.ui.selected.ability.name;

    function onClickPass() {
        sendAction($State.game, ActionType.Pass, {
            unit: $State.game.battle.units.filter(u => u.id === unit.id)[0], 
        });
        State.unselect();
    }

</script>

<style>
    .unit-card {
        width: 100%;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
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
    .ability {
        border: 1px solid #ccc;
        padding: 10px 20px;
        width: 80%;
        text-align: center;
        margin-bottom: 10px;
    }
    .ability-name {
        font-weight: bold;
        margin-bottom: 5px;
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
                    <td>{ unit.meleeAttack }</td>
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
    {#each unit.abilities as ability}
        <div class="ability"
            style="background-color:{ ability.name === selectedAbilityName ? '#f1c1c1' : null }"
            on:click={() => State.onClickAbility(ability)}
        >
            <div class="ability-name">{ ability.name }</div>
            <div class="ability-text">{ ability.text }</div>
        </div>
    {/each}
    <div>
        <button on:click={onClickPass}>PASS</button>
    </div>
</div>

