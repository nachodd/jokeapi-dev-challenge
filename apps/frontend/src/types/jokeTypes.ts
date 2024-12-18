export interface Joke {
  id: number
  type: string
  setup: string
  punchline: string
}

export type JokeType = string[]

export type SortOrder = 'asc' | 'desc' | ''
