<script setup>
import { computed } from 'vue'

import IconLink from '../icons/IconLink.vue'
import IconFile from '../icons/IconFile.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import CommonCardCategory from '../common/CommonCardCategory.vue'
import { getReplacedArrayFromString } from '@/utils/recipesHelpers'

const { item } = defineProps({
  item: {
    type: Object,
    required: true
  },
})

const linksCount = computed(() => {
  if (item.links) {
    return item.links.split(',').length
  }
  return 0
})

const ingredients = computed(() => {
    const arr = item?.ingredients.toLowerCase().split('\n').map(ing => ing.trim())
    if (arr.length === 1 && arr[0].includes(',')) {
    return getReplacedArrayFromString(arr[0], ',', ',', '').join(', ')
    //  return arr[0].split(',').map(ing => ing.trim().replace(',', '')).filter(ing => ing.length).join(', ')
    } else  {
      return arr.map(ing => ing.replace(',', '')).filter(ing => ing.length).join(', ')
    }
})

const instructions = computed(() => {
  return item.instructions.split('\n')[0].trim()
})
</script>

<template>
  <RouterLink :to="`/recipes/${item.id}`">
    <div class="heading">
      <h3 class="title">{{ item.title }}</h3>
      <CommonFavoriteBtn :recipe="item" />
    </div>
    <CommonCardCategory :recipe="item" />
    <div class="card__content">
      <dl class="content__list">
        <div class="content__item">
          <dt class="content__term">Ингредиенты</dt>
          <dd class="content__details">{{ ingredients }}</dd>
        </div>
        <div class="content__item">
          <dt class="content__term">Приготовление</dt>
          <dd class="content__details content__details--truncated">{{ instructions }}</dd>
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

.content__details--truncated {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (width < 768px) {
    white-space: normal;
  }
}
</style>