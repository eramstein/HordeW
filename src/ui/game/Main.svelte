<script>
    import { State } from '../../stores';
    import { Screen } from '../model';
    import Battle from './battle/Battle.svelte';
    //document.addEventListener('contextmenu', event => event.preventDefault());
</script>

<style>    
    .screen {
        display: flex;
        height: 100vh;
    }
    .console {
        position: absolute;
        top: 0;
        width: 100%;
    }
    .console input {
        width: 100%;
    }
</style>

<div class="screen">
   {#if $State.ui.openScreen === Screen.Battle }
        <Battle />
    {/if}
</div>

<audio id="audio"></audio>

{#if $State.ui.console.open }
    <div class="console">
        <input type="text" autofocus bind:value={$State.ui.console.value} />
    </div>
{/if}