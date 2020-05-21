<script>
    import { State } from '../../../stores';
    
    export let data;
    export let x;
    export let y;

    const PADDING = 20;
    const TILE_HEIGHT = 75;
    const TILE_WIDTH = Math.sqrt(3)/2 * TILE_HEIGHT;

    const hexPolygonPoints =
        (TILE_WIDTH * 0.5) + ',0 ' +
        TILE_WIDTH + ',' + (TILE_HEIGHT * 0.25) + ' ' +
        TILE_WIDTH + ',' + (TILE_HEIGHT * 0.75) + ' ' +
        (TILE_WIDTH * 0.5) + ',' + TILE_HEIGHT + ' ' +
        '0,' + (TILE_HEIGHT * 0.75) + ' ' +
        '0,' + (TILE_HEIGHT * 0.25);

    let tx = (x + Math.ceil(y%2)/2) * TILE_WIDTH + PADDING;
    let ty = y * (TILE_HEIGHT * 0.75) + PADDING;
    let translate = "translate(" + tx + "," + ty + ")";    

</script>

<style>
    .hex {
        cursor: pointer;
        stroke: #333;
        stroke-width: 1;
        background-size: 100% 100%;
        font-size: 12px;
    }
    text {
        font-size: 14px;
    }
</style>

<g transform={translate} on:click={() => State.onClickTile(x, y)}>
    <polygon class="hex" points={hexPolygonPoints} fill="url(#{data.terrain})"></polygon>
    <text
        x={15}
        y={TILE_HEIGHT/2 + 5}>
        {x}.{y}
    </text>
</g>

