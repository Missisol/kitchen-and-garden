<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { mainMenu } from '@/utils/mainMenu'
import { watch } from 'vue'

const route = useRoute()
console.log('route', route)

const logoText = ref('')


watch(() => route.name, () => {
  console.log('route', route.name)

  if (route.name === 'home') {
    logoText.value = 'Кухня и сад'
  }
  if (route.name === 'recipes') {
    logoText.value = 'Кухня'
  }
  if (route.name === 'garden') {
    logoText.value = 'Сад'
  }
})

</script>

<template>
  <div class="full">
    <header class="container-inner header">
      <RouterLink
        to="/"
        class="logo"
      >
        <img 
          src="@/assets/icons/logo.svg"
          alt="Logo"
          class="logo__img"
        >
        <span>{{ logoText }}</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink
          v-for="item in mainMenu"
          :key="item.name"
          :to="item.path"
        >{{ item.name }}</RouterLink>
      </nav>
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
          "logo logo actions"
          "nav nav nav";
      }

    /* & .nav {
      justify-self: end;
    } */
  }
}

.nav {
  & a {
    color: var(--color-text);
    font-weight: bold;
    text-decoration: none;
  }

  & a.router-link-active {
    color: var(--color-text-soft);
    /* text-decoration: underline; */
  }
}

.logo {
  grid-area: logo;
  display: flex;
  gap: .5rem;
  align-items: center;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: bold;
}

.logo__img {
  width: 40px;
  height: 40px;
}

.nav {
  grid-area: nav;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.actions {
  grid-area: actions;
  justify-self: end;
  background: var(--color-background);
  border: none;
}
</style>