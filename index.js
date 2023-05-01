require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID} = process.env;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* ======================================================== */

// Bot login
client.login(TOKEN);

// Bot is online
client.on('ready', () => {
    console.log(`${client.user.tag} is online.`);
});