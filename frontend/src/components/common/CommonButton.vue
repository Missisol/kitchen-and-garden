<script setup>
const { buttonType, disabled } = defineProps({
  buttonType: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['buttonAction'])
</script>

<template>
  <button
    :type="buttonType"
    :disabled="disabled"
    @click="emit('buttonAction')" 
    class="common-button"
    :class="{'common-button--disabled': disabled}"
  >
    <slot name="icon"></slot>
    <slot name="text"></slot>
  </button>
</template>

<style scoped>
.common-button {
  background: var(--cbtn-background, var(--color-primary));
  color: var(--text-color, var(--color-primary-foreground));
  border: 1px solid var(--cbtn-border, var(--color-primary));
  border-radius: calc(var(--radius) - 2px);
  padding-block: .5rem;
  padding-inline: 1rem;
  display: flex;
  gap: .5rem;
  justify-content: center;
  align-items: center;
  font-size: .875rem;
  line-height: 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.common-button--disabled {
  background: hsl(from var(--cbtn-background) h s l / 0.1);
  color: hsl(from var(--text-color) h s l / 0.3);
  cursor: default;
}

@media (hover:hover) {
  .common-button:not(:disabled):hover {
    --cbtn-fallback: var(--cbtn-background, var(--color-primary));

    background: var(--cbtn-hover, hsl(from var(--cbtn-fallback) h s l / 0.9));
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