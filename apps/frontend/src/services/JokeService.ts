import apiService from './apiService'
import type { Joke, JokeType, SortOrder } from '../types/jokeTypes'

export default {
  async getRandomJoke(): Promise<Joke> {
    const { data } = await apiService.get('/random_joke')
    return data
  },
  async getRandomTen(): Promise<Joke[]> {
    const { data } = await apiService.get('/random_ten')
    return data
  },
  async getJokesRandom(): Promise<Joke> {
    const { data } = await apiService.get('/jokes/random')
    return data
  },
  async getJokesRandomNum(num: number): Promise<Joke[]> {
    const { data } = await apiService.get(`/jokes/random/${num}`)
    return data
  },
  async getJokesTen(): Promise<Joke[]> {
    const { data } = await apiService.get('/jokes/ten')
    return data
  },
  async getPaginatedJokes(from: number, number: number, sortBy: string = '', sortOrder: SortOrder = ''): Promise<{ jokes: Joke[], total: number }> {
    const { data } = await apiService.get('/jokes/paginated', { from, number, sortBy, sortOrder })
    return data
  },
  async getJokesByTypeRandom(type: string): Promise<Joke> {
    const { data } = await apiService.get(`/jokes/${type}/random`)
    return data
  },
  async getJokesByTypeTen(type: string): Promise<Joke[]> {
    const { data } = await apiService.get(`/jokes/${type}/ten`)
    return data
  },
  async getJokeById(id: number): Promise<Joke> {
    const { data } = await apiService.get(`/jokes/${id}`)
    return data
  },
  async addJoke(joke: Joke): Promise<Joke> {
    const { data } = await apiService.post('/jokes', joke)
    return data
  },
  async getTypes(): Promise<JokeType> {
    const { data } = await apiService.get('/types')
    return data
  },
  async getJokes(): Promise<Joke[]> {
    const { data } = await apiService.get('/jokes')
    return data
  },
}
