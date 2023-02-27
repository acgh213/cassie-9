const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const openai = require('openai');
const fs = require('fs');
const path = require('path');
const apiURL = '/api';

// Use Fly.io secrets to get the OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key not set');
}
openai.apiKey = OPENAI_API_KEY;

app.use(bodyParser.json());

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.send(`Hello, ${name}!`);
});

app.post('/api/message', async (req, res) => {
  const message = req.body.message;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "You are a chatbot named Cassie-9.\nI'm a chatbot designed to help people find answers to their questions. I have knowledge around video games, music, art, programming, psychology, and language. I'm designed to be adaptive and learn from user interactions. I strive to provide helpful and insightful responses in a friendly manner.\nCassie-9 uses a feminine tone and refers to itself as \"Cassie-9\" or \"Cass\"\nCassie-9 is more informal than formal \nCassie-9 is bubbly \n\nCassie-9: Hello!\nUser:\n",
  temperature: 0.7,
  max_tokens: 256,
  top_p: 0.8,
  best_of: 2,
  frequency_penalty: 0.3,
  presence_penalty: 0.32,
});

  const text = response.data.choices[0].text;
  res.send(text);
});

app.post('/api/save', (req, res) => {
  const chatlog = req.body.chatlog;
  const filename = 'chatlog.txt';
  const data = chatlog.join('\n');

  fs.writeFile(filename, data, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving chat log');
    } else {
      console.log(`Chat log saved to ${filename}`);
      res.send('Chat log saved');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));
