<script>
    import { State } from '../../../stores';
    import { getTilePixelPos, TILE_WIDTH, TILE_HEIGHT } from './map';
    
    export let index;
    export let unit;

    $: selected = $State.ui.selected.unit === index;

    let pos;
    let translate;
    let r = TILE_WIDTH/2 - 5;

    $: {
        pos = getTilePixelPos(unit.position.x, unit.position.y);
        pos.tx += TILE_WIDTH/2;
        pos.ty += TILE_HEIGHT/2;
        translate = "translate(" + pos.tx + "," + pos.ty + ")";        
    }

</script>

<style>
    .unit {
        transition: all .4s ease;
    }
</style>

<g class="unit" transform={translate} on:click={() => State.onClickUnit(index)}>
    <circle r={ r } fill="white" stroke={selected ? "red" : "black"} stroke-width={selected ? "2" : "0.5"} />
    <circle r={ r - 5 } fill="url(#{unit.id}) white">
        { unit.name }
    </circle>
</g>

