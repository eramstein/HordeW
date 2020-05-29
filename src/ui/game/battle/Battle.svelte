<script>
    import { State } from '../../../stores';

    import Map from './Map.svelte';
    import UnitDetails from './UnitDetails.svelte';
    import MapEditor from '../../tools/MapEditor.svelte';

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
</style>

<div class="battle">
    <Map />
    <div class="sidebar">
        {#if selectedUnit}
            <UnitDetails unit={selectedUnit} />
        {/if}
        <div>
            Round {battle.round}
        </div>
        <div>
            {#each battle.log as log}
                <div>{ log.text }</div>
            {/each}
        </div>
        {#if terrainEditor}
            <MapEditor />
        {/if}
    </div>        
</div>

