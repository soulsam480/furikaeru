<script lang="ts">
  export let size: string  = '20px';
  export let iconClass: string  = '';
  export let icon: string;

  $: style = `font-size:${size}; vertical-align:-0.25em;`;
</script>

<span class={iconClass}>
  <i class="iconify" data-icon={icon} data-inline={true} {style} />
</span>
