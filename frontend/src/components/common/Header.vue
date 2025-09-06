<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const createRecipe = () => {
  router.push({ path: '/recipes/create' })
}

</script>

<template>
    <div class="full">
      <header class="container-inner header">
        <div class="logo">Logo</div>
        <nav class="nav">
          <RouterLink to="/">Рецепты</RouterLink>
          <RouterLink to="/recipes">Page</RouterLink>
        </nav>
        <button
          v-if="route.path === '/'"
          @click="createRecipe"
          type="button" 
          class="actions">
            Добавить рецепт
        </button>
      </header>
    </div>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "logo nav actions";
  gap: .5rem 1rem;

  @media (width < 380px) {
    & {
        grid-template-areas:
          "logo nav nav"
          "logo actions actions";
      }

    & .nav {
      justify-self: end;
    }
  }
}

.nav {
  & a {
    color: var(--green);
    text-decoration: none;
  }

  & a.router-link-active {
    text-decoration: underline;
  }
}

.logo {
  grid-area: logo;
}

.nav {
  grid-area: nav;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.actions {
  grid-area: actions;
  justify-self: end;
  background: var(--color-text);
  border: none;
}
</style>