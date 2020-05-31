<script>
    import { State } from '../../../stores';    
    import { getTilePixelPos, TILE_WIDTH, TILE_HEIGHT, STAGGERING_DELAY } from './map';
    
    export let data;

    let pos;
    let translate;

    $: {
        pos = getTilePixelPos(data.unit.position.x, data.unit.position.y);
        pos.tx += TILE_WIDTH/2;
        pos.ty += TILE_HEIGHT/2;
        translate = "translate(" + pos.tx + "," + pos.ty + ")";
    }

</script>

<style>
    text {
        text-anchor: middle;
        font-weight: bold;
        font-size: 12px;
    }
</style>

<g class="action-label"
    transform={translate}
>
    <rect x={-TILE_WIDTH/2} y="-9" width={TILE_WIDTH} height="20" stroke="black" stroke-width="1px" fill="white"/>
    <text x="0" y="5" fill={ data.color }>{ data.done ? 'DONE' : data.text }</text> 
</g>

