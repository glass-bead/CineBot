require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID} = process.env;

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

// Loading command files
client.commands = new Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${`./commands/${file}`} is missing a required "data" or "execute" property.`);
    } 
}

// Global variables
global.url_init = 'http://www.omdbapi.com/?t=';
global.apikey = '&apikey=8ca4715';
global.IMDBurl = 'https://www.imdb.com/title/';
global.emptyPoster = 'https://www.childlinethailand.org/wp-content/uploads/2021/04/N-A.jpeg';
global.numEmoji = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

/* ======================================================== */

// Bot login
client.login(TOKEN);

// Bot is online
client.on('ready', () => {
    console.log(`${client.user.tag} is online.`);
});

// Listen for user interactions with bot
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);
		
	try {
        await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});