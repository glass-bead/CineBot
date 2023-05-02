const fs = require('fs');
const U = require('./../Utilities/utilities.js');
const D = './data.json';

// Create data file if non existent
if (!fs.existsSync(D)) U.createFile(D)

const js = require ('jsonfile');
const data = js.readFileSync(D);
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set movie role or poll time')
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Set movie role')
                .addMentionableOption(option =>
                    option
                        .setName('movie-role')
                        .setDescription('select a role')
                        .setRequired(true)
                    ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('time')
                .setDescription('Define time for poll voting')
                .addStringOption(option =>
                    option
                        .setName('poll-time')
                        .setDescription('select a time')
                        .setRequired(true)   
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'role') {
            const role = interaction.options.getMentionable('movie-role');
            data.movieRole = role.id;
            js.writeFileSync(D, data);
            return interaction.reply({ content: `Movie role set to ${role}.`, ephemeral: true});
        }
        else if (interaction.options.getSubcommand() === 'time') {
            data.pollTime = interaction.options.getString('movie-role'); 
            js.writeFileSync(D, data);
            return interaction.reply({ content: "Poll time was set" , ephemeral: true});
        }
    }
}