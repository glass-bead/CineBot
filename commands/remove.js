const fs = require('fs');
const U = require('./../Utilities/utilities.js');
const D = './data.json';

// Create data file if non existent
if (!fs.existsSync(D)) U.createFile(D)

const js = require ('jsonfile');
const data = js.readFileSync(D);
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes movie from the watchlist. Confirmation needed.')
        .addStringOption(option =>
            option
                .setName('movie-name')
                .setDescription('select a movie name')
                .setRequired(true)
            ),
    async execute(interaction) {
        const movieName = interaction.options.getString('movie-name');
        let response = await U.search(movieName);
        
        if(response.Type === 'movie'){
            
            // Solves case where movie poster is empty
            const poster = (response.Poster != 'N/A') ? response.Poster : global.emptyPoster;

            const resultEmbed = new EmbedBuilder()
                .setTitle(response.Title)
                .setColor("#ff2050")
                .setImage(poster)
                .setDescription(response.Plot)
                .addFields(
                    { name: 'Genres:', value: response.Genre, inline: true },
                    { name: 'Release Date:', value: response.Released, inline: true },
                    { name: 'Run Time:', value: response.Runtime, inline: true },
                    { name: 'Actors:', value: response.Actors, inline: true },
                    { name: 'Director:', value: response.Director, inline: true },
                    { name: 'IMDB Rating:', value: response.imdbRating, inline: true },
                )
                .setURL(global.IMDBurl + response.imdbID);

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('confirm').setLabel('Yes').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('cancel').setLabel('No').setStyle(ButtonStyle.Danger),  
                );
            
            interaction.reply({
                embeds: [resultEmbed],
                content: "**Do you want to remove this movie from the watchlist?**", 
                components: [buttons],
                ephemeral: true
            });

            // Collect response 
            const filter = (click) => { return click.user.id === interaction.user.id; }
           
            const collector = interaction.channel.createMessageComponentCollector({ filter, max: "1", time: 10000 });

            collector.on('collect', (interacted) => {
                if (interacted.customId === 'confirm') {  
                    const index = U.exists(data.watchlist, response.Title);
                    if(index !== -1) {
                        data.watchlist.splice(index, 1);
                        js.writeFileSync(D, data);

                        interacted.reply({
                            content: "✅ The movie **" + response.Title + "** was removed to the watchlist."
                        });
                    } else {
                        interacted.reply({
                            content: "⚠️ The movie **" + response.Title + "** is NOT in the watchlist."
                        });
                    }    
                } else if (interacted.customId === 'cancel') {
                    interacted.reply({
                        content: "❌ No movie was removed to the watchlist."
                    });
                }
            });

            collector.on('end', async (collected, reason) => {
                let message = (reason === "time") ? "⚠️ Your action could not be completed. Please try again ⚠️" : "Your input has been submitted.";
                
                await interaction.editReply({
                    content: message,
                    embeds: [],
                    components: []
                }); 
            });
        } else {
            return interaction.reply("⚠️ Could not find any movie results for `" + movieName + "`. Please try again. ⚠️" );
        }
    },
};
