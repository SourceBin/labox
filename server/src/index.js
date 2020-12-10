const express = require('express');
const bodyParser = require('body-parser');

const { run, format } = require('./docker.js');

const PORT = 3000;

function handleError(err, res) {
  if (err.message === 'timeout') {
    res.status(408).json({ message: 'Execution time exceeded' });
  } else {
    console.error(err);

    res.status(500).json({ message: 'Unexpected error' });
  }
}

const app = express();
app.use(bodyParser.json());

app.post('/run', async (req, res) => {
  try {
    res.json(await run(req.body.language, req.body.executor, req.body.code));
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/format', async (req, res) => {
  try {
    res.json(await format(req.body.language, req.body.code));
  } catch (err) {
    handleError(err, res);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
