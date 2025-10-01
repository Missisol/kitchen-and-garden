<script setup>
const { focusAction, keyupAction, clearFunction, searchFunction, labelTitle } = defineProps({
  focusAction: Function,
  keyupAction: Function,
  clearFunction: Function,
  searchFunction: Function,
  labelTitle: String,
})

const model = defineModel()
</script>

<template>
  <div class="search__container">
    <label 
      for="title"
      class="search__label"
    >{{ labelTitle }}</label>
    <input
      id="title"
      type="text"
      v-model.lazy="model"
      :placeholder="labelTitle"
      class="search__input"
      maxlength="100"
      @focusin="focusAction"
      @keyup.enter="keyupAction"
    >
    <div class="search__controls">
      <div
        class="search__close"
        @click="clearFunction" 
      ><img
        src="@/assets/icons/close.svg"
        alt="Close"
      ></div>
    </div>
    <div
      class="search__search"
      @click="searchFunction"
    ><img
      src="@/assets/icons/search.svg"
      alt="Search"
    ></div>
  </div>

</template>

<style scoped>
.search__container {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-template-rows: 1fr auto;
  margin-bottom: 1rem;
}

.search__label {
  grid-row: 1 / 2;
}

.search__input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  padding-inline-end: calc(2rem + 24px);
}

.search__controls {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  place-content: center;
  gap: 1rem;
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
  width: 24px;
  height: 24px;
}

.search__search {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
</style>