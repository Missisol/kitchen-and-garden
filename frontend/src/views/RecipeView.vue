<script setup>
import { computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'
import CommonError from '@/components/common/CommonError.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import CommonCardCategory from '@/components/common/CommonCardCategory.vue'
import IconLink from '@/components/icons/IconLink.vue'
import IconFile from '@/components/icons/IconFile.vue'

const router = useRouter()
const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe, filePath } = storeToRefs(recipesStore)
const { getRecipeById, deleteRecipeById } = recipesStore

getRecipeById(route.params.id)

const links = computed(() => {
  if (recipe.value.links) {
    console.log('links', recipe.value.links)
    return recipe.value.links.split(',').map(link => link.trim())
    
  }
  return []
})

const ingredients = computed(() => {
  if (recipe.value.ingredients) {
    return recipe.value.ingredients
      .split(',')
      .map(ing => ing.trim().replace(/^[\D\S]/g, l => l.toUpperCase()))
  }
  return []
})

const instructions = computed(() => {
  if (recipe.value.instructions) {
    return recipe.value.instructions.split('\n')
  }
  return []
})

async function deleteRecipe(id) {
  await deleteRecipeById(id)
  router.push({ path: '/recipes' })
}

onBeforeUnmount(() => {
  filePath.value = ''
})
</script>

<template>
  <div class="content">
    <button
      class="back"
      @click="router.back()"
    >Назад</button>
    <section 
      v-if="!recipe.error" 
      class="recipe"
    >
      <div class="recipe__heading">
        <div class="recipe__title-box">
          <h1 class="recipe__title">{{ recipe.title }}</h1>
          <CommonCardCategory :recipe="recipe" />
        </div>
        <CommonFavoriteBtn :recipe="recipe" />
      </div>
      <div class="recipe__partition">
        <h2>Ингредиенты</h2>
        <ul>
          <li
            v-for="ing in ingredients"
            :key="ing"
            class="li--circle"
          >{{ ing }}</li>
        </ul>
      </div>
      <div class="recipe__partition">
        <h2>Инструкции</h2>
        <ul>
          <li
            v-for="instr in instructions"
            :key="instr"
          >{{ instr }}</li>
        </ul>
      </div>
      <div class="recipe__partition">
        <h2>Внешние ресурсы</h2>
        <ul v-if="recipe.links">
          <li
            v-for="link in links"
            :key="link"
            class="recipe__links"
          >
            <IconLink />
            <a
              :href="link"
              target="_blank"
              class="recipe__link"
            >{{ link }}</a>
          </li>
        </ul>
      </div>
      <div class="recipe__partition">
        <h2>Прикрепленный файл</h2>
        <div class="recipe__links">
          <IconFile />
          <a
            v-if="filePath"
            :href="filePath"
            target="_blank"
            class="recipe__link"
          >{{ recipe.file }}</a>

        </div>
      </div>
      <div class="recipe__partition">
        <h2>Комментарий</h2>
        <div class="recipe__comment-container">
          <p v-if="recipe.comment">{{ recipe.comment }}</p>
          <button type="button">Редактировать комментарий</button>
        </div>
      </div>
      <div class="wrapper">
        <button type="button">
          <RouterLink :to="`/recipes/${recipe.id}/edit`">Редактировать</RouterLink>
        </button>
        <button
          type="button"
          @click="deleteRecipe(recipe.id)"
        >Удалить</button>
      </div>
    </section>
    <section v-else>
      <CommonError :error="recipe.error" />
    </section>
  </div>
 
</template>

<style scoped>
.content {
  max-width: 56rem;
  margin-inline: auto;
}

.back {
  margin-block-end: 1.5rem;
}

.recipe {
background: var(--color-gradient-card);
box-shadow: var(--shadow-card);
padding: 2rem;
border: 1px solid hsl(from var(--color-border) h s l / 0.5);
border-radius: var(--radius);
display: flex;
flex-direction: column;
gap: 1.5rem;
}

.recipe__heading {
  --size-icon: 1.75rem;

  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-block-end: 1.25rem;
}

.recipe__title-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.recipe__title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 2.5rem;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary));
}

.recipe__partition > h2 {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-block-end: 0.75rem;
}

.recipe__partition ul {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.li--circle {
  position: relative;
  padding-left: 1rem;
}

.li--circle::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0.5em;
}

.recipe__links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.recipe__links svg {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
}

.recipe__link {
  color: var(--color-primary);
  text-decoration: none;
}

.recipe__link:hover {
  text-decoration: underline;
}

.recipe__comment-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
}

.recipe__comment-container p {
  font-style: italic;
}

.wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.wrapper button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.wrapper button:hover {
  background-color: var(--color-border);
}

.wrapper button.favorite {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #333;
}

.wrapper button.favorite:hover {
  background-color: #ffed4e;
}
</style>