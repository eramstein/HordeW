<script>
    import { State } from '../../../stores';
    import Tile from './Tile.svelte';
    import Unit from './Unit.svelte';
    import ActionLabel from './ActionLabel.svelte';
    import Tooltip from './Tooltip.svelte';
    
    $: tiles = $State.game.battle.tiles;
    $: units = $State.game.battle.units;
    $: graveyard = $State.game.battle.graveyard;
    $: highlighted = $State.ui.highlighted.tiles || {};
    $: targettable = $State.ui.highlighted.abilityTargettablePositions;
    $: unitPatterns = units.concat(graveyard).map(u => u.template);
    $: actionLabels = $State.ui.actionLabels;

    $: highlightTargets = Object.keys(targettable).length > 0;

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
            <filter id="highlight">
                <feComponentTransfer>
                    <feFuncR type="linear" slope="2" />
                    <feFuncG type="linear" slope="2" />
                    <feFuncB type="linear" slope="2" />
                </feComponentTransfer>
            </filter>
            <filter id="shade">
                <feComponentTransfer>
                    <feFuncR type="linear" slope="0.3" />
                    <feFuncG type="linear" slope="0.3" />
                    <feFuncB type="linear" slope="0.3" />
                </feComponentTransfer>
            </filter>
            <filter id="alert">
                <feComponentTransfer>
                    <feFuncR type="linear" slope="1" />
                    <feFuncG type="linear" slope="3" />
                    <feFuncB type="linear" slope="1" />
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
                    highlighted={ highlightTargets ? targettable[x + "." + y] : highlighted[x + "." + y] }
                />
            {/each}
	    {/each}
        {#each units as unit (unit.id)}
            <Unit
                unit={unit}
            />
        {/each}
        {#each actionLabels as actionLabel}
            <ActionLabel
                data={actionLabel}
            />
        {/each}
        {#if $State.ui.tooltip}
        <Tooltip />
        {/if}
    </svg>
</div>

