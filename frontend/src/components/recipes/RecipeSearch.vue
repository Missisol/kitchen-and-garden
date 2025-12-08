<script setup>
const { focusAction, keyupAction, clearFunction, searchFunction, labelTitle } = defineProps({
  focusAction: {
    type: Function,
    default: () => {}
  },
  keyupAction: {
    type: Function,
    default: () => {}
  },
  clearFunction: {
    type: Function,
    default: () => {}
  },
  searchFunction: {
    type: Function,
    default: () => {}
  },
  labelTitle: {
    type: String,
    default: ''
  },
})

const model = defineModel()
</script>

<template>
  <div class="search__box">
    <label 
      :for="labelTitle"
      class="search__label"
    >{{ labelTitle }}</label>
    <div class="search__container">
      <input
        :id="labelTitle"
        type="text"
        v-model.lazy="model"
        :placeholder="`${labelTitle}...`"
        class="search__input"
        maxlength="100"
        @focusin="focusAction"
        @keyup.enter="keyupAction"
      >
      <div
        class="search__close"
        @click="clearFunction" 
      ><img
        src="@/assets/icons/close.svg"
        alt="Close"
      ></div>
      <div
        class="search__search"
        @click="searchFunction"
      ><img
        src="@/assets/icons/search.svg"
        alt="Search"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.search__box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search__container {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-rows: auto;
}

.search__label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--color-primary);
}

.search__input {
  width: 100%;
  grid-column: 1 / 4;
  grid-row: 1 / 2;
  color: var(--color-foreground);
  background: hsl(from var(--color-background) h s l / 0.5);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  padding-block: 0.5rem;
  padding-inline: 1rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.search__input::placeholder {
  color: hsl(from var(--color-foreground) h s l / 0.6);
}

.search__close {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.search__search {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.search__close,
.search__search {
  cursor: pointer;
  display: flex;
  align-Items: center; 
  justify-content: center;
  padding-inline: 1rem;
}

.search__close > img,
.search__search > img {
  width: 1rem;
  height: 1rem;
}

.search__input:focus-visible, 
.search__input:focus {
  outline: 2px solid var(--color-ring);
}

.search__input:focus:not(:focus-visible) {
  outline: none;
}
</style>