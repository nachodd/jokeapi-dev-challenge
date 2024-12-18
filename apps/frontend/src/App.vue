<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import JokeService from './services/JokeService'
import Header from './components/Header.vue'

const randomJoke = ref('')
const isDarkMode = ref(false)

onMounted(async () => {
  randomJoke.value = await JokeService.getRandomJoke()
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <Header />

  <RouterView />
</template>

<style scoped>
.dot {
  transition: transform 0.3s ease-in-out;
}
input:checked + .dot {
  transform: translateX(100%);
}
</style>
