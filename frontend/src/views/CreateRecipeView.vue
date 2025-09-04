<script setup>
</script>

<template>
  <h1>Добавление рецепта</h1>
  <form class="form">
    <label for="title">title</label>
    <input id="title" type="text">
    <label for="ingredients">ingredients</label>
    <input id="ingredients" type="text">
    <label for="instructions">instructions</label>
    <input id="instructions" type="text">
    <label for="image">image</label>
    <input id="image" type="text">
    <label for="links">links</label>
    <input id="links" type="text">
    <label for="comment">comment</label>
    <textarea name="comment" id="comment"></textarea>
    <label for="category">category</label>
    <select id="category" type="text">
      <option value="">Option</option>
    </select>
    <button type="submit">Добавить</button>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 1rem;
  width: 400px;
}
</style>