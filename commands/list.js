const fs = require('fs');
const U = require('./../Utilities/utilities.js');
const D = './data.json';

// Create data file if non existent
if (!fs.existsSync(D)) U.createFile(D)

const js = require ('jsonfile');
const data = js.readFileSync(D);
const { 
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Returns the watchlist'),
    async execute(interaction) {
        if ((data.watchlist).length < 1) {
            interaction.reply("⚠️ The watchlist is empty. Please use the command `/add` to add movies to the list. ⚠️");
        }
        else {
            let movies = "";
            for (let i = 0; i < (data.watchlist).length; i++) {
                movies += "[**" + (i+1) + ". " + data.watchlist[i][0].Title + "**](" + global.IMDBurl + data.watchlist[i][0].imdbID + ") submited by `@" + data.watchlist[i][1] + "`\n";
            }
            
            const watchlistEmbed = new EmbedBuilder()
                .setTitle("Watchlist")
                .setColor("#ff2050")
                .setDescription(movies);

            interaction.reply({embeds: [watchlistEmbed]});
        }
    }
}