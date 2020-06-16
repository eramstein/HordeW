<script>
    import { fade } from 'svelte/transition';
    import { State } from '../../../stores';
    import { TooltipType } from '../../model';
    import { getAttackExpectation } from "../../../engine/battle/uiUtils";
    import { getTilePixelPos, isUnitActive, TILE_WIDTH, TILE_HEIGHT } from './map';
    import { AI_ANIMATION_DELAY, PLAYER_ANIMATION_DURATION, AI_ANIMATION_DURATION } from './config';
    
    export let unit;

    const HP_BAR_SIZE = TILE_HEIGHT * 0.5;
    const HP_BAR_SHIFT = -TILE_HEIGHT * 0.25;

    $: selected = $State.ui.selected.unit && $State.ui.selected.unit.id === unit.id;
    $: meleeAttackable = $State.ui.highlighted.meleeAttackableUnits[unit.id];
    $: rangeAttackable = $State.ui.highlighted.rangeAttackableUnits[unit.id];
    $: abilityTargettable = $State.ui.highlighted.abilityTargettableUnits[unit.id];
    $: abilityTargetted = $State.ui.selected.abilityTargettedUnits[unit.id];
    $: active = $State.game.battle.currentUnit === unit.id || $State.game.battle.tempLog.length > 0 && isUnitActive(unit, $State.game.battle.tempLog);

    let pos;
    let translate;
    let r = TILE_WIDTH/2 - 5;
    let hpBars = [];

    $: {
        pos = getTilePixelPos(unit.position.x, unit.position.y);
        pos.tx += TILE_WIDTH/2;
        pos.ty += TILE_HEIGHT/2;
        translate = "translate(" + pos.tx + "," + pos.ty + ")";
    }

    $: {
        hpBars = [];
        for (let i = Math.max(0, unit.hp); i < unit.hpMax; i++) {
            hpBars.push('empty');            
        }
        for (let i = 0; i < unit.hp; i++) {
            hpBars.push('full');            
        }        
    }

    $: hpColor = unit.owner === 0 ? 'green' : '#ce0e0e';
    $: circleStroke = active ? "red" : (abilityTargetted ? "blue" : "black");

    function setAttackPreview() {
        const attackPreview = getAttackExpectation($State.game, $State.ui.selected.unit, unit);
        State.setTooltip({
            position: { x: pos.tx, y: pos.ty },
            type: TooltipType.CombatPreview,
            data: {
                "Hit Chance": attackPreview.hitChance * 100 + '%',
                "Damage Range": attackPreview.damageRange.min + ' to ' + attackPreview.damageRange.max,
            },
        });
    }
    function setCcPreview() {
        let data = {};
        if (unit.cc.mezz) {
            data.Mezz = unit.cc.mezz + ' turns';
        }
        if (unit.cc.stun) {
            data.Stun = unit.cc.stun + ' turns';
        }
        if (unit.cc.root) {
            data.Root = unit.cc.root + ' turns';
        }
        State.setTooltip({
            position: { x: pos.tx, y: pos.ty },
            type: TooltipType.CombatPreview,
            data,
        });
    }
    function removeTooltip() {
        State.setTooltip(null);
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
        transition: all .4s ease;
    }
    .attack-icon, .cc-icon {
        width: 20px;
        height: 20px;
    }
</style>

<g class="unit"
    transform={translate}
    style="transition-delay:{ unit.owner === 0 ? '0s' : (PLAYER_ANIMATION_DURATION + AI_ANIMATION_DELAY) + 'ms'}"
    on:click={() => State.onClickUnit(unit)}
    on:contextmenu={() => State.onClickRightUnit(unit)}
    out:fade="{{ delay: unit.owner === 0 ? PLAYER_ANIMATION_DURATION + AI_ANIMATION_DELAY + AI_ANIMATION_DURATION : 0 }}"
    filter={ unit.used ? "url('#shade')" : (selected ? "url('#highlight')" : null) }
>
    <circle r={ r } fill="white" stroke={circleStroke} stroke-width={selected || active || abilityTargetted ? "2" : "0.5"} />
    <circle r={ r - 4 } fill="url(#{unit.template}) white">
        { unit.name }
    </circle>
    {#if unit.movesCount > 0 && !unit.used}        
        <text class="unit-info" x={13} y={12}>
            M
        </text>
    {/if}
    {#if unit.attacksCount > 0 && !unit.used}        
        <text class="unit-info" x={14} y={-4}>
            A
        </text>
    {/if}
    {#if meleeAttackable}        
        <image class="attack-icon"
            x={TILE_WIDTH/2-20-1}
            y={-1}
            on:mouseenter={() => setAttackPreview()}
            on:mouseleave={() => removeTooltip()} 
            href="assets/icons/sword.png" alt="" />
    {/if}
    {#if rangeAttackable}        
        <image class="attack-icon"
            x={TILE_WIDTH/2-20-1}
            y={-1}
            on:mouseenter={() => setAttackPreview()}
            on:mouseleave={() => removeTooltip()}
            href="assets/icons/bow.png" alt="" />
    {/if}
    {#if abilityTargettable}        
        <image class="attack-icon"
            x={TILE_WIDTH/2-20-1}
            y={-1}
            href="assets/icons/target.png" alt="" />
    {/if}
    {#if unit.cc.root}        
        <image class="cc-icon"
            x={-10}
            y={-2}
            on:mouseenter={() => setCcPreview()}
            on:mouseleave={() => removeTooltip()}
            href="assets/icons/root.png" alt="" />
    {/if}
    {#if unit.cc.mezz}        
        <image class="cc-icon"
            x={-10}
            y={-2}
            on:mouseenter={() => setCcPreview()}
            on:mouseleave={() => removeTooltip()}
            href="assets/icons/mezz.png" alt="" />
    {/if}
    {#if unit.cc.stun}        
        <image class="cc-icon"
            x={-10}
            y={-2}
            on:mouseenter={() => setCcPreview()}
            on:mouseleave={() => removeTooltip()}
            href="assets/icons/stun.png" alt="" />
    {/if}
    {#each hpBars as hpBar,i}
        <rect
            class="hp"
            x={-TILE_WIDTH/2 + 2}
            y={HP_BAR_SHIFT + HP_BAR_SIZE/hpBars.length*i}
            width="5"
            height={HP_BAR_SIZE/hpBars.length}
            style="fill:{hpBar === 'full' ? hpColor : 'gray'}"
        />
    {/each}
</g>

