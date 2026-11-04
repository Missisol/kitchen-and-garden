<script setup lang="ts">
</script>

<template>
  <div class="parent">
    <section class="hero">
      <h1>Дневник</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>теги</th>
            <th>Описание</th>
            <th>Ссылки</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Дата</td>
            <td>Теги</td>
            <td>Описание</td>
            <th>Ссылки</th>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.parent {
  --gradient: var(--gradient-secondary);
  --dim: left;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
  }

  .table th,
  .table td {
    padding: 0.5rem 1rem;
    text-align: left;
    border: 1px solid var(--color-border);
  }


</style>