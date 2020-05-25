<script>
    import { State } from '../../stores';
    import { TerrainType } from '../../engine/battle/model';

    $: selectedTerrainType = $State.ui.tools.terrainType;

    function selectTrrainType(terrain) {
        State.setTools({ terrainType: terrain });
    }

    function print() {
        console.log(JSON.stringify($State.game.battle.tiles));
    }

</script>

<style>
    .map-editor {
        margin: 20px;
    }
    .terrain-type {
        border: #ccc solid 1px;
        padding: 10px 20px;
    }
    .selected {
        background-color: azure;
    }
</style>

<div class="map-editor">
    {#each Object.keys(TerrainType) as terrain}
        <div class="{selectedTerrainType === terrain ? 'terrain-type selected' : 'terrain-type'}"
            on:click={() => selectTrrainType(terrain)}>
            { terrain }
        </div>            
    {/each}
    <br />
    <button on:click={print}>PRINT</button>
</div>