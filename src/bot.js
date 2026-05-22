const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Chargement des variables d'environnement
require('dotenv').config();

// Initialisation du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Chargement des commandes
const commands = [];
const commandDir = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandDir).filter(file => file !== 'index.js');

for (const file of commandFiles) {
    const stat = fs.statSync(path.join(commandDir, file));
    if (stat.isFile()) {
        const command = require(path.join(commandDir, file));
        commands.push(command);
    }
}

// Chargement des événements
const events = [];
const eventDir = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventDir).filter(file => file !== 'index.js');

for (const file of eventFiles) {
    const stat = fs.statSync(path.join(eventDir, file));
    if (stat.isFile()) {
        const event = require(path.join(eventDir, file));
        events.push(event);
    }
}

// Fonction pour charger les événements
function loadEvents() {
    client.on('ready', () => console.log(`Bot connecté sous le nom de ${client.user.tag}`));
    events.forEach(event => client.on(event.name, event.bind(null, client)));
}

// Fonction pour charger les commandes
function loadCommands() {
    client.commands = commands;
    client.applicationCommands = []; // Pour les commandes globales (optionnel)
}

// Initialisation du bot
async function main() {
    await client.login(process.env.DISCORD_TOKEN);
    loadEvents();
    loadCommands();
}

main();
