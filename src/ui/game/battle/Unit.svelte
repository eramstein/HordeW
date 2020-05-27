<script>
    import { State } from '../../../stores';
    import { getTilePixelPos, TILE_WIDTH, TILE_HEIGHT } from './map';
    
    export let unit;

    const HP_BAR_SIZE = TILE_HEIGHT * 0.5;
    const HP_BAR_SHIFT = -TILE_HEIGHT * 0.25;

    $: selected = $State.ui.selected.unit && $State.ui.selected.unit.id === unit.id;

    let pos;
    let translate;
    let r = TILE_WIDTH/2 - 5;
    let hpBars = [];

    $: {
        pos = getTilePixelPos(unit.position.x, unit.position.y);
        pos.tx += TILE_WIDTH/2;
        pos.ty += TILE_HEIGHT/2;
        translate = "translate(" + pos.tx + "," + pos.ty + ")";

        hpBars = [];
        for (let i = 0; i < unit.hp; i++) {
            hpBars.push('full');            
        }
        for (let i = Math.max(0, unit.hp); i < unit.hpMax; i++) {
            hpBars.push('empty');            
        }
        
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
    rect.hp {
        stroke-width:0.5;
        stroke:#333;
    }
</style>

<g class="unit"
    transform={translate}
    style="transition-delay:{ unit.owner === 0 ? '0s' : '0.5s'}"
    on:click={() => State.onClickUnit(unit)}
    on:contextmenu={() => State.onClickRightUnit(unit)}
    filter={unit.used ? "url('#used')" : null }
>
    <circle r={ r } fill="white" stroke={selected ? "red" : "black"} stroke-width={selected ? "2" : "0.5"} />
    <circle r={ r - 5 } fill="url(#{unit.template}) white">
        { unit.name }
    </circle>
    {#if unit.movesCount > 0 && !unit.used}        
        <text class="unit-info" x={13} y={5}>
            M
        </text>
    {/if}
    {#if unit.attacksCount > 0 && !unit.used}        
        <text class="unit-info" x={13} y={5}>
            A
        </text>
    {/if}
    {#each hpBars as hpBar,i}
        <rect
            class="hp"
            x={-TILE_WIDTH/2 + 2}
            y={HP_BAR_SHIFT + HP_BAR_SIZE/hpBars.length*i}
            width="5"
            height={HP_BAR_SIZE/hpBars.length}
            style="fill:{hpBar === 'full' ? '#ce0e0e' : 'gray'}"
        />
    {/each}
</g>

