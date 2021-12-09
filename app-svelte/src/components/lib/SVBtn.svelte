<script lang="ts">
  import { clsx } from 'src/utils/helpers';
  import SvIcon from './SVIcon.svelte';

  export let label = '';
  export let color = 'primary';
  export let sm = false;
  export let circle = false;
  export let ghost = false;
  export let outline = false;
  export let disabled = false;
  export let loading = false;
  export let icon = '';
  export let size = '';

  $: classes = clsx([
    'btn',
    `btn-${color}`,
    'space-x-1',
    {
      'btn-sm': sm,
      'btn-circle': circle,
      'btn-ghost': ghost,
      'btn-outline': outline,
      'btn-disabled': disabled,
      'btn-loading': loading,
    },
  ]);
</script>

<button class={classes}>
  {#if icon || $$slots.icon}
    <span>
      <slot name="icon">
        {#if icon}
          <SvIcon {icon} size={size || 'inherit'} />
        {/if}
      </slot>
    </span>
  {/if}

  {#if label || $$slots.default}
    <span>
      <slot>
        {label}
      </slot>
    </span>
  {/if}
</button>
