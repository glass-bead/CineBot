const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Answers with pong.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		await interaction.reply(`pong!`);
	},
};