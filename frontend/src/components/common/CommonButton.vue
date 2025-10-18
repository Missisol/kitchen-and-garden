<script setup>
const { buttonType, buttonAction } = defineProps({
  buttonType: {
    type: String,
    default: 'button'
  },
  buttonAction: {
    type: Function,
    default: () => {}
  }
})
</script>

<template>
  <button
    :type="buttonType"
    @click="buttonAction" 
    class="common-button"
  >
    <slot name="icon"></slot>
    <slot name="text"></slot>
  </button>
</template>

<style scoped>
.common-button {

  background: var(--cbtn-background, var(--color-primary));
  color: var(--text-color, var(--color-primary-foreground));
  border: 1px solid var(--cbtn-border, none);
  border-radius: calc(var(--radius) - 2px);
  padding-block: .5rem;
  padding-inline: 1rem;
  display: flex;
  gap: .5rem;
  align-items: center;
  font-size: .875rem;
  line-height: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: var(--cbtn-hover, hsl(from var(--cbtn-background) h s l / 0.9));
    color: var(--text-hover, var(--color-primary-foreground));
  }
}

</style>

<style>
.common-button>svg {
  width: 1rem;
  height: 1rem;
}
</style>