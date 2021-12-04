<script lang="ts">
  export let size: string | undefined = '20px';
  export let iconClass: string | undefined = '';
  export let icon: string;

  $: style = `font-size:${size}; vertical-align:-0.25em;`;
</script>

<span class={iconClass}>
  <i class="iconify" data-icon={icon} data-inline={true} {style} />
</span>
