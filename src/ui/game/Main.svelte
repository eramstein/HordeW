<script>
    import { State } from '../../stores';
    import { Screen } from '../model';
    import Battle from './battle/Battle.svelte';
</script>

<style>    
    .screen {
        display: flex;
        height: 100vh;
    }
</style>

<div class="screen">
   {#if $State.ui.openScreen === Screen.Battle }
        <Battle />
    {/if}
</div>

