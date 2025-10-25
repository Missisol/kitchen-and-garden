<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'

import CommonError from '@/components/common/CommonError.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import CommonCardCategory from '@/components/common/CommonCardCategory.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import IconLink from '@/components/icons/IconLink.vue'
import IconFile from '@/components/icons/IconFile.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'

import { getArrayFromString, getReplacedArrayFromString } from '@/utils/recipesHelpers'

const router = useRouter()
const route = useRoute()

const recipesStore =  useRecipesStore()
const { recipe, filePath } = storeToRefs(recipesStore)
const { getRecipeById, deleteRecipeById, updateRecipe } = recipesStore

// Comment editing state
const isEditingComment = ref(false)
const editedComment = ref('')

getRecipeById(route.params.id)

const links = computed(() => {
  if (recipe.value?.links) {
    if (recipe.value.links.includes('\n')) {
    return getArrayFromString(recipe.value.links, '\n')
    }
    if (recipe.value.links.includes(',')) {
      return getArrayFromString(recipe.value.links, ',') 
    }
  }
  return []
})

const ingredients = computed(() => {
  if (recipe.value?.ingredients) {
      if (recipe.value?.ingredients.includes('\n') && recipe.value.ingredients.includes(',')) {
    return getReplacedArrayFromString(recipe.value.ingredients, '\n', /^[\D\S]/g, l => l.toUpperCase())
      .map(ing => ing.replace(',', ''))
    }
    if (recipe.value?.ingredients.includes(',') || recipe.value?.ingredients.includes('\n')) {
      const symbol = recipe.value.ingredients.includes(',') ? ',' : '\n'
      return getReplacedArrayFromString(recipe.value.ingredients, symbol, /^[\D\S]/g, l => l.toUpperCase())
    }
  }
  return []
})

const instructions = computed(() => {
    return recipe.value?.instructions ? getArrayFromString(recipe.value.instructions, '\n') : []
})

const comments = computed(() => {
  return recipe.value?.comment ? getArrayFromString(recipe.value.comment, '\n')  : ''
})

async function deleteRecipe(id) {
  await deleteRecipeById(id)
  router.push({ path: '/recipes' })
}

// Comment editing functions
function startEditingComment() {
  isEditingComment.value = true
  editedComment.value = recipe.value.comment || ''
}

function cancelEditingComment() {
  isEditingComment.value = false
  editedComment.value = ''
}

async function saveComment() {
  if (editedComment.value === recipe.value.comment) {
    cancelEditingComment()
    return
  }

  try {
    await updateRecipe(recipe.value.id, { comment: editedComment.value })
    recipe.value.comment = editedComment.value
    isEditingComment.value = false
  } catch (error) {
    console.error('Error updating comment:', error)
  }
}

onBeforeUnmount(() => {
  filePath.value = ''
})
</script>

<template>
  <div class="content">
    <div class="button-back">
      <CommonButton @buttonAction="router.push({ path: '/recipes' })">
        <template #icon><IconArrowLeft /></template>
        <template #text>Назад к рецептам</template>
      </CommonButton>
    </div>
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
        <h2>Приготовление</h2>
        <ul>
          <li
            v-for="instr in instructions"
            :key="instr"
          >{{ instr }}</li>
        </ul>
      </div>
      <div
        v-if="recipe.links"
        class="recipe__partition"
      >
        <h2>Внешние ресурсы</h2>
        <ul>
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
      <div
        v-if="recipe.file"
        class="recipe__partition"
      >
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
        <h2 class="recipe__comment-title">Комментарий</h2>
        <div>
          <!-- Display comment when not editing -->
          <div
            v-if="!isEditingComment"
            class="recipe__comment-container"
          >
            <ul
              v-if="comments.length"
              class="recipe__comment-list"
            >
              <li
                v-for="comment in comments"
                :key="comment"
              >{{ comment }}</li>
            </ul>
            <div class="recipe__button-dark">
              <CommonButton @buttonAction="startEditingComment">
                <template #text>{{ recipe.comment ? 'Редактировать комментарий' : 'Добавить комментарий' }}</template>
              </CommonButton>
            </div>
          </div>
          
          <!-- Edit comment when editing -->
          <div 
            v-else 
            class="recipe__edit-comment"
          >
            <textarea
              v-model="editedComment"
              name="comment"
              placeholder="Введите комментарий..."
              class="recipe__comment-textarea"
              rows="4"
            ></textarea>
            <div class="recipe__comment-actions">
              <CommonButton
                @buttonAction="saveComment"
              >
                <template #text>Сохранить</template>
              </CommonButton>
              <div class="recipe__button-dark">
                <CommonButton @buttonAction="cancelEditingComment">
                  <template #text>Отмена</template>
                </CommonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="wrapper">
        <RouterLink :to="`/recipes/${recipe.id}/edit`">
          <CommonButton>
            <template #icon><IconEdit /></template>
            <template #text>Редактировать</template>
          </CommonButton>
        </RouterLink>
        <div class="recipe__button-red">
          <CommonButton @buttonAction="deleteRecipe(recipe.id)">
            <template #icon><IconDelete /></template>
            <template #text>Удалить</template>
          </CommonButton>
        </div>
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

.button-back {
  margin-block-end: 1.5rem;
  --cbtn-background: var(--color-background);
  --cbtn-border: var(--color-background);
  --text-color: var(--color-foreground);
  --cbtn-hover: var(--color-primary);
  --text-hover: var(--color-primary-foreground);
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

.recipe__comment-title {
  padding-inline-start: 1rem;
  margin-block-start: 0.75rem;
}

.recipe__comment-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recipe__comment-list {
  background: hsl(from var(--color-background) h s l / 0.5);
  padding: 1rem 0.75rem;
  border-radius: calc(var(--radius) - 2px);
}

.recipe__comment-container ul {
  font-style: italic;
}

.recipe__no-comment {
  color: var(--color-text-soft);
  font-style: italic;
}

.recipe__edit-comment-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
 transition: var(--transition-smooth);
  margin-top: 0.5rem;
}

.recipe__edit-comment-btn:hover {
  background-color: var(--color-border);
}

.recipe__edit-comment {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recipe__comment-textarea {
  flex-grow: 1;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-foreground);
  background: hsl(from var(--color-background) h s l / 0.5);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  padding: 0.5rem .75rem;
  resize: vertical;
  min-height: 100px;
}

.recipe__comment-textarea::placeholder {
  color: hsl(from var(--color-foreground) h s l / 0.6);
}

.recipe__comment-textarea:focus-visible, 
.recipe__comment-textarea:focus {
  outline: 2px solid var(--color-ring);
}

.recipe__comment-textarea:focus:not(:focus-visible) {
  outline: none;
}

.recipe__comment-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* TODO перенести стили в Commonbutton */
.recipe__button-dark {
  --cbtn-background: var(--color-background);
  --cbtn-border: var(--color-input);
  --text-color: var(--color-foreground);
  --cbtn-hover: var(--color-primary);
  --text-hover: var(--color-primary-foreground);
}

.recipe__button-red {
  --cbtn-background: var(--color-destructive);
  --cbtn-border: var(--color-input);
  --text-color: var(--color-foreground);
  --cbtn-hover: hsl(from var(--color-destructive) h s l / 0.9);
  --text-hover: var(--color-foreground);
}

.wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.wrapper a {
  text-decoration: none;
  flex-grow: 1;
}

.wrapper a button {
  width: 100%;
}

.wrapper a button > svg {
 width: 1rem;
 height: 1rem;
}
</style>