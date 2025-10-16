<script setup>
</script>

<template>
  <div class="hero">
    <div class="hero__icon-container">
      <slot name="icon"></slot>
    </div>
    <h1 class="hero__title">
      <slot name="title"></slot>
    </h1>
    <p class="hero__text">
      <slot name="text"></slot>
    </p>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: center;
}

.hero__icon-container {
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  background: var(--gradient, var(--gradient-primary));
  box-shadow: var(--shadow-glow);
  color: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
 }

.hero__title {
  font-size: 2.5rem;
  line-height: 2.5rem;
  font-weight: 700;
  text-wrap: nowrap;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to var(--dim, right), var(--color-primary), var(--color-secondary));
}

.hero__text {
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: var(--color-muted-foreground);
}
</style>

<style>
 svg.hero__icon {
    width: 2.5rem;
    height: 2.5rem;
  }
</style>