import { ref, watch } from 'vue'
import JokeService from '@/services/JokeService'
import type { Joke, SortOrder } from '@/types/JokeTypes.d'

const jokes = ref<Joke[]>([])
const allJokes = ref<Joke[]>([])
const totalJokes = ref(0)
const currentPage = ref(1)
const sortBy = ref<string>('')
const sortOrder = ref<SortOrder>('')
const isServerSide = ref(true)

export function useJokes(serverSide: boolean = true) {
  isServerSide.value = serverSide

  const setServerSide = (serverSide: boolean) => {
    isServerSide.value = serverSide
  }

  const updatePage = (page: number) => {
    currentPage.value = page
  }

  const fetchJokes = async (isMounting: boolean = false) => {
    if (isServerSide.value) {
      const { jokes: jokesResponse, total } = await JokeService.getPaginatedJokes((currentPage.value - 1) * 10, 10, sortBy.value, sortOrder.value)
      jokes.value = jokesResponse
      totalJokes.value = total
    } else {
      if (isMounting) {
        allJokes.value = await JokeService.getJokes()
      }
      totalJokes.value = allJokes.value.length
      updateLocalJokes()
    }
  }

  const updateLocalJokes = () => {
    const sortedJokes = [...allJokes.value]
    if (sortBy.value) {
      sortedJokes.sort((a, b) => {
        if (sortOrder.value === 'asc') {
          return a[sortBy.value as keyof Joke] > b[sortBy.value as keyof Joke] ? 1 : -1
        } else {
          return a[sortBy.value as keyof Joke] < b[sortBy.value as keyof Joke] ? 1 : -1
        }
      })
    }
    jokes.value = sortedJokes.slice((currentPage.value - 1) * 10, currentPage.value * 10)
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
  }

  const addLocalJoke = (joke: Joke) => {
    allJokes.value.push(joke)
    totalJokes.value = allJokes.value.length
    updateLocalJokes()
  }

  const editLocalJoke = (joke: Joke) => {
    const index = allJokes.value.findIndex(j => j.id === joke.id)
    allJokes.value.splice(index, 1, joke)
    updateLocalJokes()
  }

  const deleteLocalJoke = (id: number) => {
    const index = allJokes.value.findIndex(j => j.id === id)
    allJokes.value.splice(index, 1)
    totalJokes.value = allJokes.value.length
    updateLocalJokes()
  }

  return {
    jokes,
    allJokes,
    totalJokes,
    currentPage,
    sortBy,
    sortOrder,
    fetchJokes,
    updatePage,
    toggleSort,
    addLocalJoke,
    editLocalJoke,
    deleteLocalJoke,
    updateLocalJokes,
    setServerSide,
  }
}
