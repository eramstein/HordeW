<script>
    import { State } from '../../../stores';
    import { BattleStage } from '../../../engine/battle/model';

    import Map from './Map.svelte';
    import UnitDetails from './UnitDetails.svelte';
    import MapEditor from '../../tools/MapEditor.svelte';
    import Bench from './Bench.svelte';

    const EDIT_MODE = false;    
    
    $: battle = $State.game.battle;
    $: selectedUnit = $State.ui.selected.unit;
    $: terrainEditor = $State.ui.terrainEditor || EDIT_MODE;

</script>

<style>
    .battle {
        width: 100%;
        display: flex;
    }
    .sidebar {
        padding: 10px 20px;
        width: 100%;
    }
    .stage {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
        font-weight: bold;
    }
</style>

<div class="battle">
    <Map />
    <div class="sidebar">
        {#if selectedUnit}
            <UnitDetails unit={selectedUnit} />
        {:else}
            <div class="stage">
            {#if battle.stage === BattleStage.Deployment}
                Deployment
            {:else}
                Round {battle.round}
            {/if}
            </div>
            <div>
                {#each battle.log as log}
                    <div>{ log.text }</div>
                {/each}
            </div>
            {#if terrainEditor}
                <MapEditor />
            {/if}
            {#if battle.stage === BattleStage.Deployment}
                <Bench />
            {/if}
        {/if}        
    </div>        
</div>

