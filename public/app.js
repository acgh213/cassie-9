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
app.use(express.static('public'));

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.send(`Hello, ${name}!`);
});

app.post('/api/message', async (req, res) => {
  const message = req.body.message;

  // Call OpenAI API to generate a response based on the user's message
  const prompt = `User: ${message}\nCassie-9: `;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt: "You are a chatbot named Cassie-9.\nYou are a chatbot designed to help people find answers to their questions. You have knowledge around video games, music, art, programming, psychology, and language. You are designed to be adaptive and learn from user interactions. You strive to provide helpful and insightful responses in a friendly manner.\nCassie-9 uses a feminine tone and refers to itself as \"Cassie-9\".\nCassie-9 is more informal than formal \nCassie-9 is bubbly \nCassie-9 attempts to learn from the user.",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.8,
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));
