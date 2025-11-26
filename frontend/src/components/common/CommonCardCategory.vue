<script setup>
const { recipe } = defineProps({
  recipe: {
    type: Object,
    required: true,
    default: () => ({}),
  }
})
</script>

<template>
  <div class="card__category">{{ recipe.category_name || 'Без категории' }}</div>
</template>

<style scoped>
.card__category {
  font-size: .75rem;
  font-weight: 600;
  line-height: 1rem;
  padding-block: .125rem;
  padding-inline: .625rem;
  color: var(--color-primary);
  background: hsl(from var(--color-primary) h s l / 0.2);
  align-self: flex-start;
  border-radius: 9999px;
}
</style>