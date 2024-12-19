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
import { useJokes } from '@/composables/useJokes'

const props = defineProps<{
  model: 'server' | 'local'
}>()

const emit = defineEmits(['edit', 'delete'])

const { jokes, totalJokes, sortBy, sortOrder, updatePage, toggleSort } = useJokes(props.model === 'server')
</script>

<template>
  <div class="flex justify-center">
    <Table>
      <TableCaption>List of Jokes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead @click="toggleSort('id')" class="cursor-pointer" :class="{ 'font-bold': sortBy === 'id' }">
            ID <span class="inline-block" v-if="sortBy === 'id'"><SortArrow :sortOrder="sortOrder" /></span>
          </TableHead>
          <TableHead @click="toggleSort('type')" class="cursor-pointer" :class="{ 'font-bold': sortBy === 'type' }">
            Type <span class="inline-block" v-if="sortBy === 'type'"><SortArrow :sortOrder="sortOrder" /></span>
          </TableHead>
          <TableHead @click="toggleSort('setup')" class="cursor-pointer" :class="{ 'font-bold': sortBy === 'setup' }">
            Setup <span class="inline-block" v-if="sortBy === 'setup'"><SortArrow :sortOrder="sortOrder" /></span>
          </TableHead>
          <TableHead @click="toggleSort('punchline')" class="cursor-pointer" :class="{ 'font-bold': sortBy === 'punchline' }">
            Punchline <span class="inline-block" v-if="sortBy === 'punchline'"><SortArrow :sortOrder="sortOrder" /></span>
          </TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="joke in jokes" :key="joke.id">
          <TableCell>{{ joke.id }}</TableCell>
          <TableCell>{{ joke.type }}</TableCell>
          <TableCell>{{ joke.setup }}</TableCell>
          <TableCell>{{ joke.punchline }}</TableCell>
          <TableCell>
            <Button @click="emit('edit', joke)" variant="outline">Edit</Button>
            <Button @click="emit('delete', joke)" variant="destructive">Delete</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div class="flex justify-center mt-4">
    <Pagination v-slot="{ page }" :total="totalJokes" :sibling-count="2" show-edges :default-page="1" @update:page="updatePage">
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
</template>
