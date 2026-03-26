const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");
const worldSchemas = require("./worldSchemas");
const axios = require("axios");
const config = require('./configManager');

let queue = [];
let activeUser = new Set();
let isProccessing = false;

function getPage(data, page) {
    const itemsPerPage = 5;
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
}

async function proccessQueue() {
    if (isProccessing) return;
    if (queue.length === 0) return;

    isProccessing = true;

    const job = queue.shift();
    const { worldName, isPrivate, user_id, interaction } = job;

    try {
        const { data } = await axios.get(`http://${config.get('growscan.ApiLink')}/api/tes?token=${config.get('growscan.ApiKey')}&world=${worldName}`, {
            timeout: 30000, // 30 detik
        });

        const getWorldData = await data;

        let world_db = await worldSchemas.findOne({ name: worldName });

        if (getWorldData.status) {
            console.log("updating to database");
            if (world_db) {
                world_db.scanned = getWorldData.scanned;
            } else {
                world_db = new worldSchemas({
                    name: worldName,
                    scanned: getWorldData.scanned,
                });
            }
            await world_db.save();

            const itemsPerPage = 10;
            const maxPage = Math.ceil(getWorldData.scanned.length / itemsPerPage) - 1;

            console.log("sending scanned world");
            let textEmbed = "Scan result for **" + (isPrivate ? "JAMMED" : worldName) + "** <@" + interaction.user.id + ">\n\n<:dirt:1473669912374546474> **Placed BLock**\n";
            const BlockFiltered = getWorldData.scanned.filter(x => x.tipe === "block");
            const FloatingFiltered = getWorldData.scanned.filter(x => x.tipe === "floating");

            for (let item of getPage(BlockFiltered, 0)) {
                if (item.tipe == "block") {
                    textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
                }
            }

            textEmbed = textEmbed + `\n<:gems:1473669879587668009> **FLoating Item**\n`;
            for (let item of getPage(FloatingFiltered, 0)) {
                if (item.tipe == "floating") {
                    textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
                }
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|prev|${isPrivate}|${interaction.user.id}`).setLabel("⬅️").setDisabled(true).setStyle(ButtonStyle.Primary),

                new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|next|${isPrivate}|${interaction.user.id}`).setLabel("➡️").setDisabled(false).setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId(`delete|${interaction.user.id}`).setLabel("Delete Message").setDisabled(false).setStyle(ButtonStyle.Danger),
            );

            const embedGrowscan = new EmbedBuilder()
                .setColor(0x03fc07)
                .setTitle("Degs Scanner")
                .setDescription(textEmbed)
                .setFooter({
                    text: `Page ${0 + 1} / ${maxPage + 1}`,
                    iconURL: config.get('growscan.iconURL'), // Optional: URL must be https
                });

            await interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [embedGrowscan], components: [row] });
        } else {
            const embedError = new EmbedBuilder().setColor(0xf71e1e).setTitle("Error Found").setDescription(`Something was wrong, please try again later\n\nMessage From Server: ${getWorldData.message}`);

            await interaction.followUp({ embeds: [embedError] });
        }
    } catch (e) {
        console.log(e);
        const embedError = new EmbedBuilder().setColor(0xf71e1e).setTitle("Error Found").setDescription(`Something was wrong, please try again later`);

        await interaction.followUp({ embeds: [embedError] });
    } finally {
        console.log("removing from queue");
        activeUser.delete(user_id);
        isProccessing = false;
        proccessQueue();
    }
}

module.exports = {
    proccessQueue,
    queue,
    activeUser
}