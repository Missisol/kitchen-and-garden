<script setup lang="ts">
import { computed } from 'vue'

import IconLink from '../icons/IconLink.vue'
import IconFile from '../icons/IconFile.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import CommonCardCategory from '../common/CommonCardCategory.vue'
import { getReplacedArrayFromString, truncateText } from '@/utils/recipesHelpers'
import type { Recipe } from '@/types/recipe'

const { item } = defineProps<{
  item: Recipe
}>()

const linksCount = computed(() => {
  if (item.links) {
    if (item.links.includes('\n')) {
      return item.links.split('\n').length
    }
    if (item.links.includes(',')) {
      return item.links.split(',').length
    }
    return 1
  }
  return 0
})

const ingredients = computed(() => {
  if (!item?.ingredients) return ''
  const ingredientsString: string = item.ingredients.toLowerCase().replace(/#/g, '')
  const arr: string[] = ingredientsString.split('\n').map((ing: string) => ing.trim())
  let result: string
  const firstItem = arr[0]
  if (arr.length === 1 && firstItem && firstItem.includes(',')) {
    const replaced: string[] = getReplacedArrayFromString(firstItem, ',', ',', '') as string[]
    result = replaced.join(', ')
  } else {
    const mapped: string[] = arr.map((ing: string) => ing.replace(',', ''))
    const filtered: string[] = mapped.filter((ing: string) => ing.length)
    result = filtered.join(', ')
  }
  return truncateText(result)
})

const title = computed(() => {
  return item?.title ? item.title.substring(0, 1).toUpperCase() + item.title.substring(1) : ''
})
</script>

<template>
  <RouterLink 
    :to="`/recipes/${item.id}`"
    class="card__link router__link"
  >
    <div class="card__heading">
      <div class="heading">
        <h3 class="title">{{ title }}</h3>
        <CommonFavoriteBtn :recipe="item" />
      </div>
      <CommonCardCategory :recipe="item" />
    </div>
    <div class="card__content">
      <h4 class="content__term">Ингредиенты</h4>
      <p class="content__details">{{ ingredients }}</p>
    </div>
    <div class="card__bottom">
      <div
        v-if="linksCount"
        class="bottom__link"
      >
        <IconLink />
        <span>{{ linksCount }}</span>
      </div>
      <div
        v-if="item.file"
        class="bottom__link"
      >
        <IconFile />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card__heading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.heading {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.heading > button {
  flex-shrink: 0;
}

@media (hover: hover) and (pointer: fine) {
  .card:hover .title {
    color: var(--color-primary);
  }
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
  display: flex;
  flex-direction: column;
}

.content__term {
  color: var(--color-muted-foreground);
  margin-block-end: .25rem;
  font-weight: normal;
}

.content__term::after {
  content: ':';
}

.content__details {
  position: relative;
}

.card__bottom {
  display: flex;
  gap: 2rem;
}

.bottom__link {
  color: var(--color-muted-foreground);
  display: flex;
  align-items: end;
  gap: .5rem;
}

.bottom__link span {
  line-height: 1rem;
}

.bottom__link svg {
  width: 1rem;
  height: 1rem;
}

</style>