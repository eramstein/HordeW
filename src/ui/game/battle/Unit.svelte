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
    .unit-info {
        font-size: 12px;
        font-weight: bold;
    }
</style>

<g class="unit"
    transform={translate}
    style="transition-delay:{ unit.owner === 0 ? '0s' : '0.5s'}"
    on:click={() => State.onClickUnit(index)}
>
    <circle r={ r } fill="white" stroke={selected ? "red" : "black"} stroke-width={selected ? "2" : "0.5"} />
    <circle r={ r - 5 } fill="url(#{unit.id}) white">
        { unit.name }
    </circle>
    {#if unit.movesCount > 0 && unit.attacksCount === 0}        
        <text class="unit-info" x={13} y={5}>
            M
        </text>
    {/if}
    {#if unit.attacksCount > 0 && unit.movesCount === 0}        
        <text class="unit-info" x={13} y={5}>
            A
        </text>
    {/if}
</g>

