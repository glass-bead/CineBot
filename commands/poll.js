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
        .setName('poll')
        .setDescription('Creates a poll of movies to vote'),
        
    async execute(interaction) {
        const watchSize = Math.min((data.watchlist).length, 10);

        if (watchSize == 0) {
            return interaction.reply("⚠️ The watchlist is empty. Please use the command `/add` to add movies to the list. ⚠️"); 
        }

        // Shuffle watchlist
        const shuffled = [...(data.watchlist)].sort(() => 0.5 - Math.random());
        shuffled.slice(0, watchSize);

        let movies = "";
        for (let i = 0; i < watchSize; i++) {
            movies += "[**" + (i+1) + ". " + shuffled[i][0].Title + "**](" + global.IMDBurl + shuffled[i][0].IMDBurl + ") submited by `@" + shuffled[i][1] + "`\n";
        }

        const pollEmbed = new EmbedBuilder()
            .setTitle("Time to vote for a movie!")
            .setColor("#ff2050")
            .setDescription(movies);

        // If movie role not defined use @everyone as default
        const role = data.movieRole != "" ? data.movieRole : '@everyone';

        interaction.reply({content: `${role}`, embeds: [pollEmbed]});
        const message = await interaction.fetchReply();
        for (i = 0; i < watchSize; i++){
            message.react(global.numEmoji[i]);
        }

        const filter = (reaction, user) => {
            return interaction.user.id !== user.bot;
        }
       
        const collector = message.createReactionCollector({filter, time: data.pollTime});

        collector.on("collect", (reaction) => {
            if (!(global.numEmoji).includes(reaction.emoji.name)){
                reaction.remove().catch(error => console.error('Failed to remove reactions:', error));
            }
        });

        collector.on("end", (collected) => {
            let votes = [];
            collected.forEach(reaction => {
                votes.push(reaction.count);
            });
            let i = votes.indexOf(Math.max(...votes));
            
            global.winner = i; 

            // Solves case where movie poster is empty
            const poster = (shuffled[i][0].Poster != 'N/A') ? shuffled[i][0].Poster : global.emptyPoster;

            const winnerEmbed = new EmbedBuilder()
                .setTitle('**' + shuffled[i][0].Title +  '**')
                .setColor("#ff2050")
                .setImage(poster)
                .setDescription(shuffled[i][0].Plot)
                .addFields(
                    { name: 'Genres:', value: shuffled[i][0].Genre, inline: true },
                    { name: 'Release Date:', value: shuffled[i][0].Released, inline: true },
                    { name: 'Run Time:', value: shuffled[i][0].Runtime, inline: true },
                    { name: 'Actors:', value: shuffled[i][0].Actors, inline: true },
                    { name: 'Director:', value: shuffled[i][0].Director, inline: true },
                    { name: 'IMDB Rating:', value: shuffled[i][0].imdbRating, inline: true },
                )
                .setURL(global.IMDBurl + shuffled[i][0].imdbID)
                .setFooter({ text: "To host a movie night with this movie use the `/host` command"});

            interaction.editReply({
                embeds: [winnerEmbed],
                content: "The voting has ended! Here's the winner:"
            });

            message.reactions.removeAll();
        });
    },
};