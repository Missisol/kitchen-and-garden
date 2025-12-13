<script setup>
import CommonHero from '@/components/common/CommonHero.vue'
import IconChefhat from '@/components/icons/IconChefhat.vue'
import IconSprout from '@/components/icons/IconSprout.vue'
</script>

<template>
  <div class="hero__wrapper">
    <RouterLink
      to="/recipes"
      class="router__link"
    >
      <CommonHero>
        <template #icon>
          <IconChefhat />
        </template>
        <template #title>Рецепты</template>
        <template #text>Управляйте своими рецептами</template>
      </CommonHero>
    </RouterLink>
    <RouterLink
      to="/garden"
      class="router__link"
    >
      <CommonHero>
        <template #icon>
          <IconSprout />
        </template>
        <template #title>Сад</template>
        <template #text>Управляйте своим садом</template>
      </CommonHero>
    </RouterLink>
  </div>
</template>

<style scoped>
.hero__wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 2rem;
}

.hero__wrapper a {
  text-decoration: none;
}

:is(.hero__wrapper a:nth-child(even)) {
  --gradient: var(--gradient-secondary);
  --dim: left;
}
</style>