const express = require('express');
const LimitingMiddleware = require('limiting-middleware');
const { types, randomJoke, randomTen, randomSelect, jokeByType, jokeById, count, getPaginatedJokes, addJoke, updateJoke, deleteJoke, jokes } = require('./handler');

const app = express();

app.use(new LimitingMiddleware().limitByIp());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/<any-number>');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/random_joke', (req, res) => {
  res.json(randomJoke());
});

app.get('/random_ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/random', (req, res) => {
  res.json(randomJoke());
});

app.get("/jokes/random/:num", (req, res) => {
  let num;
  try {
    num = parseInt(req.params.num);
    if (!num) {
      res.send("The passed path is not a number.");
    } else {
      if (num > count) {
        res.send(`The passed path exceeds the number of jokes (${count}).`);
      } else {
        res.json(randomSelect(num));
      }
    }
  } catch (e) {
    return next(e);
  }
});

app.get('/jokes/ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/paginated', (req, res, next) => {
  try {
    const { from, number, sortBy, sortOrder } = req.query;
    const fromIndex = parseInt(from, 10);
    const num = parseInt(number, 10);

    if (isNaN(fromIndex) || isNaN(num)) {
      return res.status(400).send('Invalid query parameters');
    }

    const result = getPaginatedJokes(fromIndex, num, sortBy, sortOrder);
    res.json(result);
  } catch (e) {
    return next(e);
  }
});

app.get('/jokes/:type/random', (req, res) => {
  res.json(jokeByType(req.params.type, 1));
});

app.get('/jokes/:type/ten', (req, res) => {
  res.json(jokeByType(req.params.type, 10));
});

app.get('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

app.post('/jokes', (req, res, next) => {
  try {
    const { type, setup, punchline } = req.body;
    if (!type || !setup || !punchline) {
      return res.status(400).send('Invalid joke data');
    }
    const newJoke = addJoke({ type, setup, punchline });
    res.status(201).json(newJoke);
  } catch (e) {
    return next(e);
  }
});

app.put('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, setup, punchline } = req.body;
    if (!type || !setup || !punchline) {
      return res.status(400).send('Invalid joke data');
    }
    const updatedJoke = updateJoke({ id: +id, type, setup, punchline });
    res.status(200).json(updatedJoke);
  } catch (e) {
    return next(e);
  }
});

app.delete('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    deleteJoke(+id);
    res.status(204).send();
  } catch (e) {
    return next(e);
  }
});

app.get('/types', (req, res, next) => {
  res.json(types);
})

app.get('/jokes', (req, res) => {
  res.json(jokes);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: 'error', message: err.message
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

