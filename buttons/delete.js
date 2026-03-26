const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const worldSchemas = require("../worldSchemas");
const { flags } = require("../command/scan_world");



module.exports = {
	name: "delete",

	async execute(interaction) {
        try {
            const [command, user_id] = interaction.customId.split("|");

            if (interaction.user.id == user_id ) {
                console.log("trying delete message "+user_id)
                await interaction.message.delete();
            } else {
                interaction.reply({
                    content: 'Lau siape mpruy mau hapus punya orang',
                    flags: MessageFlags.Ephemeral
                })
            }
        } catch(e) {
            console.log('cannot delete msg'+e)
        }
	},
};
