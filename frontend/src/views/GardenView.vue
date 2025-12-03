<script setup>
</script>

<template>
  <div class="parent">
    Раздел в разработке
  </div>
</template>

<style scoped>
.parent {
  --gradient: var(--gradient-secondary);
  --dim: left;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "hero"
                        "filter" 
                        "content";
  gap: 2rem;
}
</style>