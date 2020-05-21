<script>
    import { State } from '../../../stores';    

    import Tile from './Tile.svelte';    
    
    $: tiles = $State.game.battle.tiles;

</script>

<style>
    #tiles-container{
        background-color: rgb(184, 212, 184);
    }
</style>

<div class="battle">
    <svg id="tiles-container"
        width="1400"
        height="1200"
    >
        <defs>
            <pattern id="FOREST" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Forest_Topdown.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="HILLS" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Hills_Topdown.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="MOUNTAIN" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Mountain_Topdown.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="DESERT" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Desert_Mono.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="PLAINS" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Grassland_Mono.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="WATER" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Water_Mono.png" x="0" y="0" width="120" height="120" /></pattern>
            <pattern id="WATER_SHALLOW" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Water_Shallow_Mono.png" x="0" y="0" width="120" height="120" /></pattern>
        </defs>
        {#each tiles as row, x}
            {#each row as tile, y}
                <Tile                    
                    x={x}
                    y={y}
                    data={tile}
                />
            {/each}
	    {/each}        
    </svg>
</div>

