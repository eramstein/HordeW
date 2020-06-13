<script>
    import { State } from '../../../stores';

    const MARGIN = 50;
    const PADDING = 10;
    const BLOCK_HEIGHT = 20;
    let TITLE_SIZE = 120;
    
    let position;
    let translate;
    let textBlocks = [];

    $: {
        if ($State.ui.tooltip) {
            position = $State.ui.tooltip.position;
            translate = "translate(" + position.x + "," + position.y + ")";
            textBlocks = Object.entries($State.ui.tooltip.data).map(entry => {
                return {
                    title: entry[0],
                    content: entry[1],
                };
            });
        }        
    }

</script>

<style>
    rect {
        stroke: black;
        fill: #eee;
    }
    .title {
        font-weight: bold;
        width: 100px;
        text-align: right;
    }
</style>

<g transform={translate}>
    <rect y={MARGIN - BLOCK_HEIGHT} width="200" height={textBlocks.length * BLOCK_HEIGHT + PADDING}>
    </rect>
    {#each textBlocks as block,i}
        <text x={PADDING} y={i * BLOCK_HEIGHT + MARGIN} class="title">
            { block.title }
        </text>
        <text x={PADDING + TITLE_SIZE} y={i * BLOCK_HEIGHT + MARGIN}>
            { block.content }
        </text>
    {/each}    
</g>

