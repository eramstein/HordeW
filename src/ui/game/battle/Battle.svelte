<script>
    import { State } from '../../../stores';

    import Map from './Map.svelte';
    import MapEditor from '../../tools/MapEditor.svelte';

    const EDIT_MODE = true;
    
    $: battle = $State.game.battle;
    $: terrainEditor = $State.ui.terrainEditor || EDIT_MODE;

</script>

<style>
    .battle {
        width: 100%;
        display: flex;
    }
    .sidebar {
        padding: 10px 20px;
    }
</style>

<div class="battle">
    <Map />
    <div class="sidebar">
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

