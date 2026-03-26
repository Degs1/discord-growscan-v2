const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const worldSchemas = require("../worldSchemas");
const { flags } = require("../command/scan_world");
const { proccessQueue, queue, activeUser } = require("../proccessqueue.js");



module.exports = {
    name: "leavequeue",

    async execute(interaction) {
        try {
            const [command, user_id, action] = interaction.customId.split("|");
            console.log("leaving from queue "+ user_id)
            if (action === 'leave' && activeUser.has(user_id)) {
                activeUser.delete(user_id)
            }

            if (action === 'leave' && queue.some(a => a.user_id === user_id)) {
                queue.splice(queue.findIndex(b => b.user_id === user_id),1)
            }

        } catch(e) {
            console.log('cannot leave from queue'+e)

        }
    },
};
