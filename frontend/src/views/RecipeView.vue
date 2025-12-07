<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRecipesStore } from '@/stores/recipes'

import RecipeLayout from '@/components/recipes/RecipeLayout.vue'
import CommonError from '@/components/common/CommonError.vue'
import CommonFavoriteBtn from '@/components/common/CommonFavoriteBtn.vue'
import CommonCardCategory from '@/components/common/CommonCardCategory.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import IconLink from '@/components/icons/IconLink.vue'
import IconFile from '@/components/icons/IconFile.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

import { getArrayFromString, parseIngredientsWithHeadings, parseIngredients } from '@/utils/recipesHelpers'

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
    return [recipe.value.links]
  }
  return []
})

const ingredients = computed(() => {
  if (recipe.value?.ingredients) {
    // Check if ingredients contain headings (lines starting with "#")
    if (recipe.value.ingredients.includes('#')) {
      return parseIngredientsWithHeadings(recipe.value.ingredients)
    }
    // Fallback to original logic for backward compatibility
    return parseIngredients(recipe.value.ingredients)
  }
  return []
})

const instructions = computed(() => {
  if (recipe.value?.instructions) {
    const result = []
    const arr = getArrayFromString(recipe.value.instructions, '\n')
    arr.map(item =>  item.includes('#') ? result.push({ heading: item.replace(/^#/g, ''), text: null}) : result.push({ heading: null, text: item}) )
    return result
  }
  return []
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
  <RecipeLayout
    @action="router.push({ path: '/recipes' })"
    text="Назад к рецептам"
  >  
    <template
      v-if="!recipe.error"
      #recipe
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
        <template v-if="ingredients.length > 0">
          <template
            v-for="(section, sectionIndex) in ingredients"
            :key="sectionIndex"
          >
            <h3
              v-if="section.heading"
              class="recipe__subtitle"
            >{{ section.heading }}</h3>
            <ul
              v-if="section.items && section.items.length > 0"
              class="recipe__ingredients-list"
            >
              <li
                v-for="(item, itemIndex) in section.items"
                :key="itemIndex"
                class="li--circle"
              >{{ item }}</li>
            </ul>
          </template>
        </template>
      </div>
      <div class="recipe__partition">
        <h2>Приготовление</h2>
        <ul>
          <li
            v-for="{ heading, text} in instructions"
            :key="heading || text"
          >
            <h3
              v-if="heading"
              class="recipe__subtitle"
            >{{ heading }}</h3>
            <p v-if="text">{{ text }}</p>
          </li>
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
            <div class="common-button--dark">
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
              <div class="common-button--dark">
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
        <div class="common-button--red">
          <CommonButton @buttonAction="deleteRecipe(recipe.id)">
            <template #icon><IconDelete /></template>
            <template #text>Удалить</template>
          </CommonButton>
        </div>
      </div>
    </template>
    <template
      v-else
      #recipe
    >
      <div >
        <CommonError :error="recipe.error" />
      </div>
    </template>
  </RecipeLayout>
</template>

<style scoped>
.recipe__heading {
  --size-icon: 1.75rem;

  display: flex;
  justify-content: space-between;
  align-items: start;
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

  @media (width < 768px) {
    font-size: 1.5rem;
    line-height: 2rem;
  }
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

.recipe__subtitle {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
  text-decoration: underline;
  margin-block-start: 1rem;
  margin-block-end: 0.5rem;
}

.recipe__subtitle:first-of-type {
  margin-block-start: 0;
}

li +li:has(h3.recipe__subtitle) {
  margin-block-start: 1rem;
}

.recipe__ingredients-list {
  margin-block-end: 0.5rem;
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
  align-items: baseline;
}

.recipe__links svg {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.recipe__link {
  color: var(--color-primary);
  text-decoration: none;
  word-break: break-all;
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