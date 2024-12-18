<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { MenuIcon, XIcon, SunIcon, MoonStarIcon } from 'lucide-vue-next'


const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const isDarkMode = ref(false)
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
 <header class="bg-background">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <div class="flex-shrink-0 flex gap-2">
          <svg width="100" height="50" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" class="fill-current text-gray-800 dark:text-white">

            <rect x="10" y="10" width="10" height="10" />
            <rect x="10" y="20" width="10" height="10" />
            <rect x="10" y="30" width="10" height="10" />

            <rect x="33" y="20" width="7" height="10" />
            <rect x="40" y="20" width="10" height="10" />
            <rect x="50" y="20" width="7" height="10" />
            <rect x="40" y="13" width="10" height="7" />
            <rect x="40" y="30" width="10" height="7" />

            <rect x="70" y="10" width="10" height="10" />
            <rect x="70" y="20" width="10" height="10" />
            <rect x="70" y="30" width="10" height="10" />
            <rect x="80" y="10" width="10" height="10" />
            <rect x="80" y="30" width="10" height="10" />
            <rect x="90" y="15" width="5" height="10" />
            <rect x="90" y="20" width="10" height="10" />
            <rect x="90" y="25" width="5" height="10" />
          </svg>
          <span class="self-center text-xs font-semibold whitespace-nowrap dark:text-white" title="Ignacio Durand">Ignacio+Durand</span>
        </div>

        <!-- Nav Links -->
        <nav class="hidden sm:flex space-x-4">
          <RouterLink to="/"><Button variant="ghost" class="text-foreground">Home</Button></RouterLink>
          <RouterLink to="/about"><Button variant="ghost" class="text-foreground">About</Button></RouterLink>
          <Button variant="ghost" class="text-foreground" @click="toggleDarkMode">
            <SunIcon v-if="!isDarkMode" class="h-6 w-6" />
            <MoonStarIcon v-else class="h-6 w-6" />
          </Button>
        </nav>

        <!-- Mobile menu button -->
        <div class="sm:hidden">
          <Button variant="ghost" class="text-foreground" @click="toggleMobileMenu">
            <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <RouterLink to="/"><Button variant="ghost" class="w-full text-left text-foreground">Home</Button></RouterLink>
        <RouterLink to="/about"><Button variant="ghost" class="w-full text-left text-foreground">About</Button></RouterLink>
      </div>
    </div>

    <div class="h-px bg-border"></div>
  </header>

</template>
