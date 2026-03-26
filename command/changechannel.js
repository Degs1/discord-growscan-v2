const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");
const worldSchemas = require("../worldSchemas");
const axios = require("axios");
const config = require('../configManager');


module.exports = {
	flags: 64,
	data: new SlashCommandBuilder()
		.setName("changechannel")
		.setDescription("change growscan channel")
		.addStringOption(option => option.setName("id").setDescription("ID of the channel").setRequired(true)),
	async execute(interaction) {

        try {

            if (interaction.user.id !== config.get('growscan.ownerId')) {
                await interaction.editReply('Lau siape mpruy');
                return;
            }
            const channelID = interaction.options.getString("id");

            config.set('growscan.growscanChannel',channelID)

            await interaction.editReply(`Successfully edit channel to <#${channelID}>`)
        } catch(e) {
            console.log(e)
            await interaction.editReply(`Something was wrong while editing channel ID`)
        }
    }
}