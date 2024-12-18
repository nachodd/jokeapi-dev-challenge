import apiService from './apiService'
import type { Joke, JokeType } from '../types/jokeTypes'

export default {
  getRandomJoke() {
    return apiService.get('/random_joke')
  },
  getRandomTen() {
    return apiService.get('/random_ten')
  },
  getJokesRandom() {
    return apiService.get('/jokes/random')
  },
  getJokesRandomNum(num: number) {
    return apiService.get(`/jokes/random/${num}`)
  },
  getJokesTen() {
    return apiService.get('/jokes/ten')
  },
  getPaginatedJokes(from: number, to: number, number: number) {
    return apiService.get('/jokes/paginated', { from, to, number })
  },
  getJokesByTypeRandom(type: string) {
    return apiService.get(`/jokes/${type}/random`)
  },
  getJokesByTypeTen(type: string) {
    return apiService.get(`/jokes/${type}/ten`)
  },
  getJokeById(id: number) {
    return apiService.get(`/jokes/${id}`)
  },
  addJoke(joke: Joke) {
    return apiService.post('/jokes', joke)
  },
  getTypes() {
    return apiService.get('/types')
  }
}
