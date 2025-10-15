<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { mainMenu } from '@/utils/mainMenu'
// import IconSun from '../icons/IconSun.vue'
import IconMoon from '../icons/IconMoon.vue'
// import IconSystem from '../icons/IconSystem.vue'
import IconLogo from '../icons/IconLogo.vue'

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
        class="logo__container"
      >
        <div class="logo">
          <IconLogo />
        </div>
        <span class="logo__text">Кухня и сад</span>
      </RouterLink>
      <div class="header__container">
        <nav class="nav">
          <RouterLink
            v-for="item in mainMenu"
            :key="item.name"
            :to="item.path"
            :class="route.name"
          >{{ item.name }}</RouterLink>
        </nav>
        <button class="header__theme">
          <IconMoon />     
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-inline: 1rem;
  /* padding: 1rem; */
  height: 4rem;
}

.logo__container {
  display: flex;
  gap: .5rem;
  align-items: center;
  text-decoration: none;
}

.logo__container:hover .logo {
  transform: scaleX(1.1) scaleY(1.1)
}

.logo {
  display: flex;
  gap: .5rem;
  justify-content: center;
  align-items: center;
  color: var(--color-accent);
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: var(--gradient-primary);
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-glow);
  color: var(--color-background);
}

.logo>svg {
  width: 24px;
  height: 24px;
  color: var(--color-background);
}

.logo__text {
  font-size: 1.25rem;
  font-weight: 700;
  color: transparent;
  background-clip: text;
  background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary));
}

.header__container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav {
  display: flex;
  gap: .25rem;
  justify-content: center;
  align-items: center;

  & a {
    color: var(--color-muted-foreground);
    font-weight: 500;
    text-decoration: inherit;
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius);
    transition: var(--transition-smooth);
    height: 40px;
  }

  & a:hover {
    color: car(--color-foreground);
    background: var(--color-muted);
  }

  & a.router-link-exact-active:first-child {
    color: var(--color-primary);
    background-color: hsl(from var(--color-primary) h s l / 0.1);
  }

  & a.router-link-exact-active:last-child {
    color: var(--color-secondary);
    background-color: hsl(from var(--color-secondary) h s l / 0.1);
  }
}

.header__theme {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--color-background);
  border: 1px solid var(--color-input);
  border-radius: calc(var(--radius) - 2px);
  transition: var(--transition-smooth);
  color: var(--color-foreground);
}

.header__theme:hover {
  background: var(--color-accent);
  color: var(--accent-foreground);
}

.header__theme>svg {
  width: 16px;
  height: 16px;
}
</style>