<script setup>

const model = defineModel('model')
const { categories, idName, className,  isDefaultOption, isDisabledCondition } = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
  idName: {
    type: String,
    required: false,
  },
  className: {
    type: String,
    required: false,
  },
  selected: {
    type: Boolean,
    default: true,
  },
  isDefaultOption: {
    type: Boolean,
    default: false,
  },
  isDisabledCondition: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <select
    v-model="model"
    name="category"
    :id="idName"
    class="category-select"
    :class="className"
  >
    <option
      v-if="isDefaultOption"
      value=""
      :selected="true"
      disabled
    >--Выберите категорию--</option>
    <option 
      v-for="category in categories" 
      :key="category.id" 
      :value="category.id"
      :disabled="isDisabledCondition ? category?.name === '' : false"
    >{{ category?.name || 'Без категории' }}</option>
  </select>

</template>

<style scoped>
select,
::picker(select) {
  appearance: base-select;
}

select::picker-icon {
  color: var(--color-muted-foreground);
  transition: 0.4s rotate;
}

select:open::picker-icon {
  rotate: 180deg;
}

::picker(select) {
  border: none;
}

option:disabled {
  color: var(--color-muted-foreground);
}

option {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  border: 2px solid var(--color-input);
  background: var(--color-background);
  padding: .5rem;
  transition: 0.4s;
}

option:first-of-type {
  border-radius: .5rem .5rem 0 0;
}

option:last-of-type {
  border-radius: 0 0 .5rem .5rem;
}

::picker(select) {
  border-radius: .5rem;
}

option:not(option:last-of-type) {
  border-bottom: none;
}

option:nth-of-type(odd) {
  background: var(--color-gradient-card);
}

option:hover:not(:disabled),
option:focus {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight: 600;
}
</style>