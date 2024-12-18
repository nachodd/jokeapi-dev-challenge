<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import SortArrow from '@/components/SortArrow.vue'

import { ref, onMounted } from 'vue'
import JokeService from '@/services/JokeService'
import type { Joke, SortOrder } from '@/types/jokeTypes'

const jokes = ref<Joke[]>([])
const totalJokes = ref(0)
const currentPage = ref(1)
const sortBy = ref<string>('')
const sortOrder = ref<SortOrder>('')

const fetchJokes = async (page: number) => {
  const { jokes: jokesResponse, total } = await JokeService.getPaginatedJokes((page - 1) * 10, 10, sortBy.value, sortOrder.value)
  jokes.value = jokesResponse
  totalJokes.value = total
  currentPage.value = page
}

const toggleSort = (field: string) => {
  if (sortBy.value === field) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else if (sortOrder.value === 'desc') {
      sortOrder.value = ''
      sortBy.value = ''
    } else {
      sortOrder.value = 'asc'
    }
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
  fetchJokes(currentPage.value)
}

onMounted(() => {
  fetchJokes(currentPage.value)
})
</script>

<template>
  <main class="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-center">Joke API Demo</h1>
    <div class="flex justify-center">
      <Table>
        <TableCaption>List of Jokes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead @click="toggleSort('id')" :class="{ 'font-bold': sortBy === 'id' }">
              ID <span class="inline-block" v-if="sortBy === 'id'"><SortArrow :sortOrder="sortOrder" /></span>
            </TableHead>
            <TableHead @click="toggleSort('type')" :class="{ 'font-bold': sortBy === 'type' }">
              Type <span class="inline-block" v-if="sortBy === 'type'"><SortArrow :sortOrder="sortOrder" /></span>
            </TableHead>
            <TableHead @click="toggleSort('setup')" :class="{ 'font-bold': sortBy === 'setup' }">
              Setup <span class="inline-block" v-if="sortBy === 'setup'"><SortArrow :sortOrder="sortOrder" /></span>
            </TableHead>
            <TableHead @click="toggleSort('punchline')" :class="{ 'font-bold': sortBy === 'punchline' }">
              Punchline <span class="inline-block" v-if="sortBy === 'punchline'"><SortArrow :sortOrder="sortOrder" /></span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="joke in jokes" :key="joke.id">
            <TableCell>{{ joke.id }}</TableCell>
            <TableCell>{{ joke.type }}</TableCell>
            <TableCell>{{ joke.setup }}</TableCell>
            <TableCell>{{ joke.punchline }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex justify-center mt-4">
      <Pagination v-slot="{ page }" :total="totalJokes" :sibling-count="2" show-edges :default-page="1" @update:page="fetchJokes">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />

          <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
              <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </main>
</template>
