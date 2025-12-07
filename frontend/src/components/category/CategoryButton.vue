<script setup>
</script>

<template>
  <button
    type="button"
    class="button"
  ><span class="button__text">
    <slot></slot>  
  </span>
  </button>
</template>

<style scoped>
.button {
  background: var(--color-background);
  border: 1px solid var(--color-input);
  border-radius: 24px;
  padding: 6px 16px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  transition: var(--transition-smooth);
  min-width: max-content;
}

.button .button__text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}

@media (hover:hover) {
  .button:hover {
    color: var(--color-accent-foreground);
    background: var(--color-accent);
  }
}

.category--active>.button {
  color: var(--color-primary-foreground); 
  background: var(--color-primary);
}

.button:hover .button__text,
.category--active>.button .button__text {
  text-shadow:
    0 0 8px var(--color-button-shadow);
}
</style>