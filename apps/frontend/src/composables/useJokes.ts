import { ref, onMounted } from 'vue'
import JokeService from '@/services/JokeService'
import type { Joke, SortOrder } from '@/types/jokeTypes'

export function useJokes() {
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

  return {
    jokes,
    totalJokes,
    currentPage,
    sortBy,
    sortOrder,
    fetchJokes,
    toggleSort
  }
}
