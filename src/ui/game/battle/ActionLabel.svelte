<script>
    import { State } from '../../../stores';    
    import { getTilePixelPos, TILE_WIDTH, TILE_HEIGHT, STAGGERING_DELAY } from './map';
    
    export let data;
    export let labelIndex;

    let pos;
    let translate;

    $: {
        pos = getTilePixelPos(data.unit.position.x, data.unit.position.y);
        pos.tx += TILE_WIDTH/2;
        pos.ty += TILE_HEIGHT/2;
        translate = "translate(" + pos.tx + "," + pos.ty + ")";
    }

    setTimeout(
        (data) => { document.getElementById('label-' + labelIndex).style.visibility = 'hidden'; },
        (data.index + 1) * STAGGERING_DELAY,
        labelIndex,
    );

    setTimeout(
        (data) => { document.getElementById('label-' + labelIndex).style.visibility = 'visible'; },
        data.index * STAGGERING_DELAY,
        labelIndex,
    );

</script>

<style>
    .action-label {
        visibility: hidden;
    }
    text {
        text-anchor: middle;
        font-weight: bold;
        font-size: 12px;
    }
</style>

<g class="action-label"
    id={"label-"+labelIndex}
    transform={translate}
>
    <rect x={-TILE_WIDTH/2} y="-9" width={TILE_WIDTH} height="20" stroke="black" stroke-width="1px" fill="white"/>
    <text x="0" y="5" fill={ data.color }>{ data.done ? 'DONE' : data.text }</text> 
</g>

