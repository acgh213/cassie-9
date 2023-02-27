const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const openai = require('openai');

// Set up OpenAI API credentials
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
openai.apiKey = OPENAI_API_KEY;

app.use(bodyParser.json());

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.send(`Hello, ${name}!`);
});

app.post('/api/message', async (req, res) => {
  const message = req.body.message;

  // Call OpenAI API to generate a response based on the user's message
  const prompt = `Guardian: ${message}\nCassie-9: `;
  const response = await openai.completions.create({
    engine: 'text-davinci-002',
    prompt: prompt,
    maxTokens: 1024,
    n: 1,
    stop: '\n'
  });

  const text = response.data.choices[0].text;
  res.send(text);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));