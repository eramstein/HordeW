<script>
    import { State } from '../../../stores';
    
    $: units = $State.game.battle.factions[0].bench;
    $: selected = $State.ui.selected.benchUnit && $State.ui.selected.benchUnit.id;

</script>

<style>
    .done {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
    .done button {
        width: 150px;
    }
    .unit {
        display: flex;
        border: 1px solid #ccc;
        margin-bottom: 5px;
    }
    .unit-image {
        display: flex;
        height: 40px;
        width: 40px;
        background-repeat: no-repeat, repeat;
        background-color:#ccc;
        background-size: contain;
    }
    .unit-name {
        padding-left: 10px;
        display: flex;
        align-items: center;
    }
</style>

<div class="bench">
    {#each units as unit}
        <div class="unit"
            style="background-color:{ selected && selected === unit.id ? '#f1f1f1' : null }"
            on:click={() => State.onClickBenchUnit(unit)}
        >
            <div class="unit-image" style="background-image:url('assets/units/{unit.template}.png')">
            </div>
            <div class="unit-name">
                { unit.name }
            </div>
        </div>
    {/each}
    <div class="done">
        <button on:click={() => State.onClickEndDeployment()}>
            DONE
        </button>
    </div>
</div>

