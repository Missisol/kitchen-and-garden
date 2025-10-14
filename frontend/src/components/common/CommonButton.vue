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
    <slot></slot>
  </button>
</template>

<style scoped>
.common-button {
  background: var(--bgcolor, var(--color-button));
  border: 1px solid var(--color-border);
  border: none;
  border-radius: 24px;
  color: var(--color, var(--color-text-soft));
  padding: var(--padding, 4px 8px);
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: var(--color-button-hover);
    color: var(--color-background-soft);
  }
}
</style>