import os
import discord
from flask import Flask, request
from openai import OpenAIApi, Configuration

app = Flask(__name__)
client = discord.Client()

configuration = Configuration(
    api_key=os.environ.get('OPENAI_API_KEY')
)
openai = OpenAIApi(configuration)

@client.event
async def on_ready():
    print('Logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    response = requests.post('http://localhost:5000/message', json={'message': message.content})
    response_text = response.json()['response']
    await message.channel.send(response_text)

    print(f'{message.content} --> {response_text}')

@app.route('/message', methods=['POST'])
def handle_message():
    message = request.json['message']
    response = openai.create_completion(
        model="text-davinci-003",
        prompt=f"The following is a conversation with an AI assistant named Cassie-9. {message}",
        temperature=0.79,
        max_tokens=120,
        top_p=0.77,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=[" Human:", " AI:"]
    )
    print(f'{message} --> {response.choices[0].text}')
    return {'response': response.choices[0].text}

client.run(os.environ.get('DISCORD_BOT_TOKEN'))
