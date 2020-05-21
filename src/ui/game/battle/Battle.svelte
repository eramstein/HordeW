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
    .map-editor {
    }
</style>

<div class="battle">
    <Map />
    {#if terrainEditor}
        <MapEditor />
    {/if}    
</div>

