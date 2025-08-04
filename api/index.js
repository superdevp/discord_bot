const { Client, GatewayIntentBits } = require('discord.js');
const openai = require('openai'); // Use the new OpenAI package import
require('dotenv').config();

// Configure OpenAI
const openaiClient = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Directly pass the API key
});

// Configure Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith('~')) return;

  const userQuery = message.content.replace('~', '').trim();

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userQuery }],
    });

    const reply = response.choices[0].message.content;
    message.reply(reply);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    message.reply('Sorry, I encountered an error while processing your request.');
  }
});

client.login(process.env.DISCORD_TOKEN);
