const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { MongoClient } = require("mongodb");
const worldSchemas = require("../worldSchemas");
const axios = require("axios");
const config = require("../configManager");
const { proccessQueue, queue, activeUser } = require("../proccessqueue.js");

// let queue = [];
// let activeUser = new Set();
// let isProccessing = false;

// function getPage(data, page) {
// 	const itemsPerPage = 5;
// 	const start = page * itemsPerPage;
// 	const end = start + itemsPerPage;
// 	return data.slice(start, end);
// }

// async function proccessQueueold() {
// 	if (isProccessing) return;
// 	if (queue.length === 0) return;

// 	isProccessing = true;

// 	const job = queue.shift();
// 	const { worldName, isPrivate, user_id, interaction } = job;

// 	try {
// 		const { data } = await axios.get(`http://localhost:5000/api/tes?token=kontol&world=${worldName}`, {
// 			timeout: 30000, // 30 detik
// 		});

// 		const getWorldData = data;

// 		let world_db = await worldSchemas.findOne({ name: worldName });

// 		if (getWorldData.status) {
// 			console.log("updating to database");
// 			if (world_db) {
// 				world_db.scanned = getWorldData.scanned;
// 			} else {
// 				world_db = new worldSchemas({
// 					name: worldName,
// 					scanned: getWorldData.scanned,
// 				});
// 			}
// 			await world_db.save();

// 			const itemsPerPage = 10;
// 			const maxPage = Math.ceil(getWorldData.scanned.length / itemsPerPage) - 1;

// 			console.log("sending scanned world");
// 			let textEmbed = "Scan result for **" + (isPrivate ? "JAMMED" : worldName) + "** <@" + interaction.user.id + ">\n\n<:dirt:1473669912374546474> **Placed BLock**\n";
// 			const BlockFiltered = getWorldData.scanned.filter(x => x.tipe === "block");
// 			const FloatingFiltered = getWorldData.scanned.filter(x => x.tipe === "floating");

// 			for (let item of getPage(BlockFiltered, 0)) {
// 				if (item.tipe == "block") {
// 					textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
// 				}
// 			}

// 			textEmbed = textEmbed + `\n<:gems:1473669879587668009> **FLoating Item**\n`;
// 			for (let item of getPage(FloatingFiltered, 0)) {
// 				if (item.tipe == "floating") {
// 					textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
// 				}
// 			}

// 			const row = new ActionRowBuilder().addComponents(
// 				new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|prev|${isPrivate}|${interaction.user.id}`).setLabel("⬅️").setDisabled(true).setStyle(ButtonStyle.Primary),

// 				new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|next|${isPrivate}|${interaction.user.id}`).setLabel("➡️").setDisabled(false).setStyle(ButtonStyle.Primary),
// 				new ButtonBuilder().setCustomId(`delete|${interaction.user.id}`).setLabel("Delete Message").setDisabled(false).setStyle(ButtonStyle.Danger),
// 			);

// 			const embedGrowscan = new EmbedBuilder()
// 				.setColor(0x03fc07)
// 				.setTitle("Degs Scanner")
// 				.setDescription(textEmbed)
// 				.setFooter({
// 					text: `Page ${0 + 1} / ${maxPage + 1}`,
// 					icon_url: 'https://cdn.discordapp.com/icons/1390847062718939167/27faa0be8a233ae3d677642389412a88.webp?size=240&quality=lossless', // Optional: URL must be https
// 				});

// 			await interaction.followUp({ content: `<@${interaction.user.id}>`, embeds: [embedGrowscan], components: [row] });
// 		} else {
// 			const embedError = new EmbedBuilder().setColor(0xf71e1e).setTitle("Error Found").setDescription(`Something was wrong, please try again later\n\nMessage From Server: ${getWorldData.message}`);

// 			await interaction.followUp({ embeds: [embedError] });
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		const embedError = new EmbedBuilder().setColor(0xf71e1e).setTitle("Error Found").setDescription(`Something was wrong, please try again later`);

// 		await interaction.followUp({ embeds: [embedError] });
// 	} finally {
// 		console.log("removing from queue");
// 		activeUser.delete(user_id);
// 		isProccessing = false;
// 		proccessQueue();
// 	}
// }

module.exports = {
	flags: 64,
	data: new SlashCommandBuilder()
		.setName("growscan")
		.setDescription("Scans a world and updates the database with the scanned data.")
		.addStringOption(option => option.setName("world").setDescription("The name of the world to scan").setRequired(true))
		.addBooleanOption(option => option.setName("is_private").setDescription("Show or not world name").setRequired(true)),
	async execute(interaction) {
        if (!config.get('growscan.isBotOnline')) return await interaction.editReply('Bot is Offline, please try again later');
		const worldName = interaction.options.getString("world").toUpperCase();
		const isPrivate = interaction.options.getBoolean("is_private");

		if (!worldName) {
			await interaction.editReply({ content: "Please provide a world name to scan.", flags: MessageFlags.Ephemeral });
			return;
		} else if (interaction.channel.id !== config.get("growscan.growscanChannel")) {
			await interaction.editReply({ content: `Use growscan in channel <#${config.get("growscan.growscanChannel")}>`, flags: MessageFlags.Ephemeral });
			return;
		}

		if (activeUser.has(interaction.user.id)) {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`leavequeue|${interaction.user.id}|leave`).setLabel("Leave Queue ?").setDisabled(false).setStyle(ButtonStyle.Danger),
            );
			return interaction.editReply({
				content: `you are stil in Queue **${queue.findIndex(a => a.user_id === interaction.user.id) + 1}/${queue.length}**`,
                components: [row],
				ephemeral: true,
			});
		}

		activeUser.add(interaction.user.id);

		queue.push({
			worldName: worldName,
			user_id: interaction.user.id,
			isPrivate: isPrivate,
			interaction,
		});

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`leavequeue|${interaction.user.id}|leave`).setLabel("Leave Queue ?").setDisabled(false).setStyle(ButtonStyle.Danger),
		);

		await interaction.editReply({
			content: `successfully adding to queue **${queue.findIndex(a => a.user_id === interaction.user.id) + 1}/${queue.length}**`,
            components: [row]
		});

		proccessQueue();

		// try {
		// 	const getWorldData = await fetch("http://localhost:3000/api/tes").then(res => res.json());

		// 	if (getWorldData.status) {
		// 		console.log("updating to database");
		// 		if (world_db) {
		// 			world_db.scanned = getWorldData.scanned;
		// 		} else {
		// 			world_db = new worldSchemas({
		// 				name: worldName,
		// 				scanned: getWorldData.scanned,
		// 			});
		// 		}
		// 		await world_db.save();

		// 		const itemsPerPage = 10;
		// 		const maxPage = Math.ceil(getWorldData.scanned.length / itemsPerPage) - 1;

		// 		console.log("sending scanned world");
		// 		let textEmbed = "Scann result for **" + (isPrivate ? "JAMMED" : worldName) + "**\n\n**Placed BLock**\n";
		// 		const BlockFiltered = getWorldData.scanned.filter(x => x.tipe === "block");
		// 		const FloatingFiltered = getWorldData.scanned.filter(x => x.tipe === "floating");

		// 		for (let item of getPage(BlockFiltered, 0)) {
		// 			if (item.tipe == "block") {
		// 				textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
		// 			}
		// 		}

		// 		textEmbed = textEmbed + `\n**FLoating Item**\n`;
		// 		for (let item of getPage(FloatingFiltered, 0)) {
		// 			if (item.tipe == "floating") {
		// 				textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
		// 			}
		// 		}

		// 		const row = new ActionRowBuilder().addComponents(
		// 			new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|prev|${isPrivate}|${interaction.user.id}`).setLabel("⬅️").setDisabled(true).setStyle(ButtonStyle.Primary),

		// 			new ButtonBuilder().setCustomId(`growscan|${worldName}|${0}|next|${isPrivate}|${interaction.user.id}`).setLabel("➡️").setDisabled(false).setStyle(ButtonStyle.Primary),
		// 			new ButtonBuilder().setCustomId(`delete|${interaction.user.id}`).setLabel("Delete Message").setDisabled(false).setStyle(ButtonStyle.Danger),
		// 		);

		// 		const embedGrowscan = new EmbedBuilder()
		// 			.setColor(0x0099ff)
		// 			.setTitle("Degs Scanner")
		// 			.setDescription(textEmbed)
		// 			.setFooter({
		// 				text: `Page ${0 + 1} / ${maxPage + 1}`,
		// 				icon_url: "URL_TO_YOUR_ICON", // Optional: URL must be https
		// 			});

		// 		await interaction.editReply({ embeds: [embedGrowscan], components: [row] });
		// 	}
		// } catch (e) {
		// 	console.log(e);
		// }
	},
};
