<script setup lang="ts">
import { MoveUpIcon, MoveDownIcon } from 'lucide-vue-next'
import type { SortOrder } from '@/types/JokeTypes.d'
const { sortOrder } = defineProps<{
  sortOrder: SortOrder
}>()
</script>
<template>
  <template v-if="sortOrder==='asc'"><MoveUpIcon class="h-3 w-3"/></template>
  <template v-else><MoveDownIcon class="h-3 w-3"/></template>
</template>
