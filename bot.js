const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Charger les fichiers
require('dotenv').config();
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const db = require('./database');

// Initialiser le client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Charger les commandes
const commands = {
  stalk: require('./commands/stalk'),
  antistalk: require('./commands/antistalk'),
  utils: require('./commands/utils')
};

// Charger les événements
const events = {
  ready: require('./events/ready'),
  message: require('./events/message')
};

// Fonction pour vérifier les permissions
function checkPermission(userId) {
  return config.permissions[userId] || false;
}

// Déploiement du bot
client.on('ready', () => {
  console.log(`✅ Bot connecté comme ${client.user.tag}`);
  events.ready(client);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(config.salons.prefix)) return;

  const args = message.content.slice(config.salons.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (checkPermission(message.author.id)) {
    commands[command]?.execute(message, args, client, db);
  } else {
    message.reply('❌ Commande interdite. Seuls les propriétaires peuvent utiliser ce bot.');
  }
});

client.login(process.env.BOT_TOKEN);
