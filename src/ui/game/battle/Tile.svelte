<script>
    import { State } from '../../../stores';
    import { TILE_WIDTH, TILE_HEIGHT, getTilePixelPos } from './map';
    
    export let data;
    export let x;
    export let y;
    export let highlighted;

    $: abilityTargetted = $State.ui.selected.abilityTargettedPositions[x + "." + y];

    const hexPolygonPoints =
        (TILE_WIDTH * 0.5) + ',0 ' +
        TILE_WIDTH + ',' + (TILE_HEIGHT * 0.25) + ' ' +
        TILE_WIDTH + ',' + (TILE_HEIGHT * 0.75) + ' ' +
        (TILE_WIDTH * 0.5) + ',' + TILE_HEIGHT + ' ' +
        '0,' + (TILE_HEIGHT * 0.75) + ' ' +
        '0,' + (TILE_HEIGHT * 0.25);

    const { tx, ty } = getTilePixelPos(x, y);
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

<g transform={translate}
    on:click={() => State.onClickTile(x, y)}
    on:contextmenu={() => State.onClickRightTile(x, y)}
>
    <polygon class="hex"
        points={hexPolygonPoints}
        fill="url(#{data.terrain})"
        style="stroke: { abilityTargetted ? 'blue' : null }; stroke-width: { abilityTargetted ? 3 : 1 }"
        filter={highlighted ? "url('#highlight')" : null }></polygon>
        <text
            x={15}
            y={TILE_HEIGHT/2 + 5}>
            {x}.{y}
        </text>
        <!--
        <text
            x={0}
            y={TILE_HEIGHT/2 - 5}
            style="font-size:12px;fill:red"
        >
            {$State.ui.tools.aiTileValues && $State.ui.tools.aiTileValues[x][y].threatMax}
            to
            {$State.ui.tools.aiTileValues && $State.ui.tools.aiTileValues[x][y].threatTotal}
        </text>
        <text
            x={15}
            y={TILE_HEIGHT/2 + 20}
            style="font-size:12px;fill:green"
        >
            {$State.ui.tools.aiTileValues && $State.ui.tools.aiTileValues[x][y].bounty}
        </text>
        -->
</g>

