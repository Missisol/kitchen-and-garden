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
  background: var(--bgcolor, var(--c-green));
  /* border: 1px solid var(--c-green); */
  border: none;
  border-radius: 4px;
  color: var(--color, var(--vt-c-white));
  padding: var(--padding, 4px 8px);
  text-align: center;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: var(--c-green-soft);
  }
}
</style>