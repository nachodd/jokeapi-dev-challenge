const fs = require('fs');
const path = require('path');
const jokes = require('./jokes/index.json');

let lastJokeId = 0;
jokes.forEach(jk => jk.id = ++lastJokeId);

const types = Array.from(new Set(jokes.map(joke => joke.type)));

const randomJoke = () => {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray, n) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map(randomIndex => {
    return jokeArray[randomIndex];
  });
};

const randomTen = () => randomN(jokes, 10);

const randomSelect = (number) => randomN(jokes, number);

const jokeByType = (type, n) => {
  return randomN(jokes.filter(joke => joke.type === type), n);
};

const count = Object.keys(jokes).length;

/**
 * @param {Number} id - joke id
 * @returns a single joke object or undefined
 */
const jokeById = (id) => (jokes.filter(jk => jk.id === id)[0]);

/**
 * Get paginated jokes
 * @param {Number} from - start index
 * @param {Number} number - number of jokes to return
 * @param {String} sortBy - field to sort by
 * @param {String} sortOrder - order to sort (asc or desc)
 * @returns {Object} - paginated jokes and hasMore flag
 */
const getPaginatedJokes = (from, number, sortBy = '', sortOrder = '') => {
  let sortedJokes = jokes;

  if (sortBy) {
    sortedJokes = jokes.slice().sort((a, b) => {
      if (sortOrder === 'desc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      }
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });
  }

  const to = from + number;
  const paginatedJokes = sortedJokes.slice(from, to).slice(0, number);
  const hasMore = to < jokes.length;
  return { jokes: paginatedJokes, hasMore, total: jokes.length };
};

/**
 * Add a new joke
 * @param {Object} joke - joke object with type, setup, and punchline
 * @returns {Object} - the added joke with id
 */
const addJoke = (joke) => {
  const newJoke = { ...joke, id: ++lastJokeId };
  jokes.push(newJoke);
  fs.writeFileSync(path.join(__dirname, './jokes/index.json'), JSON.stringify(jokes, null, 2));
  return newJoke;
};

/**
 * Update an existing joke
 * @param {Object} joke - joke object with id, type, setup, and punchline
 * @returns {Object} - the updated joke
 */
const updateJoke = (joke) => {
  const index = jokes.findIndex(jk => jk.id === joke.id);
  if (index === -1) {
    throw new Error('Joke not found');
  }
  jokes[index] = joke;
  fs.writeFileSync(path.join(__dirname, './jokes/index.json'), JSON.stringify(jokes, null, 2));
  return joke;
};

/**
 * Delete a joke by ID
 * @param {Number} id - joke id
 */
const deleteJoke = (id) => {
  const index = jokes.findIndex(jk => jk.id === id);
  if (index === -1) {
    throw new Error('Joke not found');
  }
  jokes.splice(index, 1);
  fs.writeFileSync(path.join(__dirname, './jokes/index.json'), JSON.stringify(jokes, null, 2));
};

module.exports = {
  jokes,
  types,
  randomJoke,
  randomN,
  randomTen,
  randomSelect,
  jokeById,
  jokeByType,
  count,
  getPaginatedJokes,
  addJoke,
  updateJoke,
  deleteJoke
};
