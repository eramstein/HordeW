<script>
    import { State } from '../../../stores';
    import { UNITS } from '../../../data/units/units';

    import Tile from './Tile.svelte';
    import Unit from './Unit.svelte';

    const unitPatterns = Object.keys(UNITS);    
    
    $: tiles = $State.game.battle.tiles;
    $: units = $State.game.battle.units;
    $: highlighted = $State.ui.highlighted.tiles || {};

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
            <filter id="highlightStroke">
                <feComponentTransfer>
                    <feFuncR type="linear" slope="2" />
                    <feFuncG type="linear" slope="2" />
                    <feFuncB type="linear" slope="2" />
                </feComponentTransfer>
            </filter>

            <pattern id="FOREST" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Forest_Topdown.png" /></pattern>
            <pattern id="HILLS" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Hills_Topdown.png" /></pattern>
            <pattern id="MOUNTAIN" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Mountain_Topdown.png" /></pattern>
            <pattern id="DESERT" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Desert_Mono.png" /></pattern>
            <pattern id="PLAINS" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Grassland_Mono.png" /></pattern>
            <pattern id="WATER" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Water_Mono.png" /></pattern>
            <pattern id="WATER_SHALLOW" patternUnits="userSpaceOnUse" width="120" height="120"><image xlink:href="assets/terrains/Water_Shallow_Mono.png" /></pattern>
            
            {#each unitPatterns as unit}
            <pattern id={unit} width="100%" height="100%" viewBox="0 0 120 120">                
                <image width="120" height="120" xlink:href="assets/units/{unit}.png" />
            </pattern>
            {/each}

        </defs>
        {#each tiles as row, x}
            {#each row as tile, y}
                <Tile                    
                    x={x}
                    y={y}
                    data={tile}
                    highlighted={highlighted[x + "." + y]}
                />
            {/each}
	    {/each}
        {#each units as unit, i}
            <Unit
                unit={unit}
                index={i}
            />
        {/each}
    </svg>
</div>

