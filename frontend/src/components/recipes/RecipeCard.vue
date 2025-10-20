<script setup>
import { computed } from 'vue'

import IconStar from '../icons/IconStar.vue'
import IconLink from '../icons/IconLink.vue'
import IconFile from '../icons/IconFile.vue';

const { item, toggleFavorite } = defineProps({
  item: {
    type: Object,
    required: true
  },
  toggleFavorite: {
    type: Function,
    required: true,
    default: () => {},
  }
})

const linksCount = computed(() => {
  if (item.links) {
    return item.links.split(',').length
  }
  return 0
})
</script>

<template>
  <RouterLink :to="`/recipes/${item.id}`">
    <div class="heading">
      <h3 class="title">{{ item.title }}</h3>
      <button
        type="button"
        class="favorite-btn"
        :class="{ favorite: item.favorite }"
        @click.prevent.stop="toggleFavorite(item)"
      >
        <IconStar />
      </button>
    </div>
    <div class="card__category">{{ item.category_name || 'Без категории' }}</div>
    <div class="card__content">
      <dl class="content__list">
        <div class="content__item">
          <dt class="content__term">Ингредиенты</dt>
          <dd class="content__details">{{ item.ingredients }}</dd>
        </div>
        <div class="content__item">
          <dt class="content__term">Приготовление</dt>
          <dd class="content__details">{{ item.instructions }}</dd>
        </div>
        <div
          v-if="linksCount"
          class="content__links"
        >
          <dt><IconLink /></dt> 
          <dd>{{ linksCount }}</dd>
        </div>
        <div
          v-if="item.file"
          class="content__links"
        >
          <dt><IconFile /></dt>
        </div>
      </dl>
    </div>
  </RouterLink>

</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card:hover .title {
  color: var(--color-primary);
}

.title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: var(--color-heading);
  transition: var(--transition-smooth);
}

.label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.favorite-btn svg {
  width: 20px;
  height: 20px;
}

.favorite-btn.favorite svg {
  color: var(--color-primary);
fill: var(--color-primary);
}

.favorite-btn:hover {
  transform: scale(1.1)
}

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

.card__content {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.content__list {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.card__content dt {
  color: var(--color-muted-foreground);
  margin-block-end: .25rem;
}

.content__term::after {
  content: ':';
}

.content__links {
  color: var(--color-muted-foreground);
  display: flex;
  gap: .5rem;
}

.content__links svg {
  width: 1rem;
  height: 1rem;
}

</style>