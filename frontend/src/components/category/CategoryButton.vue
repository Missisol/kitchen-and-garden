<script setup>
</script>

<template>
  <button
    type="button"
    class="button"
  ><span class="button__text">
    <slot />  
  </span>
  </button>
</template>

<style scoped>
.button {
  background: var(--color-background);
  border: none;
  border-radius: 24px;
  color: var(--color-text);
  padding: 4px 16px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  filter: drop-shadow(16px 0px 10px rgba(178,150,104, 0.5));
  filter: drop-shadow(0px 0px 2px var(--color-text));
  transition: all 0.2s ease-in-out;
  min-width: max-content;
}

.button .button__text {
  font-weight: 400;
  font-size: 18px;
  text-shadow: none;
  transition: text-shadow 0.2s ease-in-out;
}

.button:hover {
  color: var(--color-button-shadow);
}

.category--active>.button {
  color: var(--color-button-shadow); 
  filter: drop-shadow(0px 0px 8px var(--color-button-shadow));
}

.button:hover .button__text,
.category--active>.button .button__text {
  text-shadow:
    0 0 8px var(--color-button-shadow);
}
</style>