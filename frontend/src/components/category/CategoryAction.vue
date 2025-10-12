<script setup>
import CommonButton from '../common/CommonButton.vue'

const { title, idName, buttonTitle } = defineProps({
  title: {
    type: String,
    default: ' ',
  },
  idName: {
    type: String,
    default: 'cat',
  },
  buttonTitle: {
    type: String,
    default: ' ',
  }
})

const emit = defineEmits(['submitAction'])
</script>

<template>
  <section class="action">
    <!-- <h4>{{ title }}</h4> -->
    <form
      class="action__form"
      @submit="emit('submitAction', $event)"
    >
      <label 
        :for="idName" 
        class="action__label"
      >{{ title }}</label>

      <div class="action__slot">
        <slot></slot>
      </div>
      <div class="action__button">
        <CommonButton :buttonType="'submit'">{{ buttonTitle }}</CommonButton>
      </div>
    </form>
  </section>
</template>

<style scoped>
.action__form {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 
          "label label"
          "slot button";
  align-items: end;
  gap: .5rem;
}

.action__label {
  grid-area: label;
  font-weight: bold;
}

.action__slot {
  grid-area: slot;
}

/* .action__slot {
  margin-block-start: .5rem;
}
 */
.action__slot > * {
  /* width: 100%; */
}

.action__slot {
  /* width: 100%; */
}


.action__button {
  --padding: 2px 8px;
  grid-area: button;
  align-self: end;
}
</style>