const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js'); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Answers with pong.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		await interaction.reply(`pong!`);
	},
};