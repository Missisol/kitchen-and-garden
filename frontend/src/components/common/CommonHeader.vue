<script setup>
import { mainMenu } from '@/utils/mainMenu'
</script>

<template>
  <div class="full">
    <header class="container-inner header">
      <div class="logo">
        <RouterLink to="/">Logo</RouterLink>
      </div>
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
    color: var(--green);
    text-decoration: none;
  }

  & a.router-link-active {
    text-decoration: underline;
  }
}

.logo {
  grid-area: logo;

  & a {
    color: var(--green);
    text-decoration: none;
  }
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