let U = require('./../Utilities/utilities.js');
const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Looks up and displays movie details')
        .addStringOption(option =>
            option
                .setName('movie-name')
                .setDescription('select a movie name')
                .setRequired(true)
            ),
    async execute(interaction) {
        const movieName = interaction.options.getString('movie-name');
        let response = await U.search(movieName);

        if (response.Type === 'movie') {

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
            
            return await interaction.reply({ embeds: [resultEmbed] });
        } else {
            return await interaction.reply("⚠️ Could not find any movie results for `" + movieName + "`. Please try again. ⚠️" );
        }
    },
};