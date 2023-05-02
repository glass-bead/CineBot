const fs = require('fs');
const U = require('./../Utilities/utilities.js');
const D = './data.json';

// Create data file if non existent
if (!fs.existsSync(D)) U.createFile(D)

const js = require ('jsonfile');
const data = js.readFileSync(D);
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('host')
        .setDescription('Hosts a movie night at a certain time')
        .addStringOption(option =>
            option
                .setName('movie-name')
                .setDescription('Select movie to watch')
                .setRequired(true)
            )
        .addNumberOption(option =>
            option
                .setName('hour')
                .setDescription('Select what hour (GTM) to watch the movie')
                .setRequired(true)
            )
        .addNumberOption(option =>
            option
                .setName('minute')
                .setDescription('Select what time (GTM) to watch the movie ')
                .setRequired(true)
            ),
    async execute(interaction) {
        const movieName = interaction.options.getString('movie-name');
        const hostHour = interaction.options.getNumber('hour');
        const hostMin = interaction.options.getNumber('minute');

        let response = await U.search(movieName);

        if (response.Type === 'movie') {
            
            // Schedule time
            var currDate = new Date();
            var targetDate = new Date();
            
            targetDate.setHours(hostHour, hostMin);

            if (targetDate.getTime() < currDate.getTime()) {
                return interaction.reply("⚠️ Please provide a valid time ⚠️");
            }

            var diff = (targetDate.getTime() - currDate.getTime());

            // Solves case where movie poster is empty
            const poster = (response.Poster != 'N/A') ? response.Poster : global.emptyPoster;

            // Fix min string 
            const minute = (hostMin < 10) ? 0 + hostMin.toString() : hostMin.toString()
            
            const hostEmbed = new EmbedBuilder()
                .setTitle('Movie Night Scheduled!')
                .setColor("#ff2050")
                .setThumbnail(poster)
                .addFields(
                    { name: 'Title:', value: response.Title, inline: true },
                    { name: 'Time:', value: hostHour.toString() + ':' + minute + ' GTM', inline: true },
                )
                .setFooter({ text: "React with 🍿 to join or ❎ if you can't. " });
            
            // If movie role not defined use @everyone as default
            const role = data.movieRole != "" ? data.movieRole : '@everyone';

            // Define the emojis to add to the bot message
            const emojis = ['🍿', '❎'];

            interaction.reply({ content: `${role}`, embeds: [hostEmbed] })
                .then(async (message) => {
                    // Wait for the bot to reply to the message with a reply
                    message = await interaction.fetchReply();

                    // Add each emoji to the bot message using the react() method
                    emojis.forEach(emoji => message.react(emoji));

                    // Create a filter to collect reactions only from non-bot users
                    const filter = (reaction, user) => !user.bot;

                    // Create a reaction collector for the bot's message using the filter
                    const collector = message.createReactionCollector({ filter, time: diff });

                    let voted = [];
            
                    collector.on('collect', (reaction, user) => {
                        // Collect all users that vote 🍿
                        if (reaction.emoji.name === '🍿') {
                            voted.push(user.id);
                        }
                        // If user react with ❎ after reacting with 🍿, remove the second form the list
                        else if (reaction.emoji.name === '❎') {
                            if (voted.includes(user.id)) {
                                message.reactions.resolve('🍿').users.remove(user.id);
                                voted.splice(voted.indexOf(user.id), 1);
                            }
                        // If user reacts with another emoji, remove it
                        } else if (!emojis.includes(reaction.emoji.name)) {
                            reaction.remove(user).catch(error => console.error('Failed to remove reactions:', error));
                        }
                    });

                    // Notify members that voted 🍿 that is time to watch the movie
                    collector.on('end', (collected) => {
                        var notifEmbed;
                        let names = "";
                        voted.forEach(member => names += "<@"+ member + "> " );
                        
                        if (names == "") {
                            notifEmbed = new EmbedBuilder()
                                .setTitle("Oh bummer! 😔")
                                .setColor("#ff2050")
                                .setDescription(`**It seems no one wanted to watch ${response.Title}...\nMaybe next time!**`)
                                .setThumbnail(poster);
                        } else {
                            notifEmbed = new EmbedBuilder()
                                .setTitle("🍿 It's movie time! 🍿")
                                .setColor("#ff2050")
                                .setDescription(`**Attention ${names}!!\nGrab your popcorn, it's time to watch ${response.Title}!**`)
                                .setThumbnail(poster);
                        }
                        
                        // Remove reactions
                        message.reactions.removeAll();

                        interaction.followUp({ embeds: [notifEmbed] });
                    });
                })
                .catch(console.error);
        } else {
            return interaction.reply("⚠️ Could not find any movie results for `" + movieName + "`. Please try again. ⚠️" );    
        }       
    },
};