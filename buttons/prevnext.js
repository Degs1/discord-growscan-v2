const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");
const worldSchemas = require("../worldSchemas");

function getPage(data, page) {
	const itemsPerPage = 5;
	const start = page * itemsPerPage;
	const end = start + itemsPerPage;
	return data.slice(start, end);
}

module.exports = {
	name: "growscan",

	async execute(interaction) {
		try {
			const [command, world, pageStr, action, private,user_id] = interaction.customId.split("|");

			let page = parseInt(pageStr);

			if (action === "next") page++;
			if (action === "prev") page--;

			const data = await worldSchemas.findOne({ name: world });

			const itemsPerPage = 10;
			const maxPage = Math.ceil(data.scanned.length / itemsPerPage) - 1;

			if (page < 0) page = 0;
			if (page > maxPage) page = maxPage;

			console.log("updating scanned world " + world + " to page " + page + " is_private " + private);
			let textEmbed = "Scan result for **" + (private == "true" ? "JAMMED" : world) + "** <@"+user_id+">\n\n<:dirt:1473669912374546474> **Placed Block**\n";
			const BlockFiltered = data.scanned.filter(x => x.tipe === "block");
			const FloatingFiltered = data.scanned.filter(x => x.tipe === "floating");

			for (let item of getPage(BlockFiltered, page)) {
				if (item.tipe == "block") {
					textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
				}
			}

			textEmbed = textEmbed + `\n<:gems:1473669879587668009> **FLoating Item**\n`;
			for (let item of getPage(FloatingFiltered, page)) {
				if (item.tipe == "floating") {
					textEmbed = textEmbed + `- ${item.name} : **${item.count}**\n`;
				}
			}

			const embed = {
				title: `Degs Growscan`,
				description: textEmbed,
                color: 0x03fc07,
				footer: {
					text: `Page ${page + 1} / ${maxPage + 1}`,
                    icon_url: 'https://cdn.discordapp.com/icons/1390847062718939167/27faa0be8a233ae3d677642389412a88.webp?size=240&quality=lossless'
				},
			};

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`growscan|${world}|${page}|prev|${private}|${user_id}`)
					.setLabel("⬅️")
					.setDisabled(page === 0 ? true : false)
					.setStyle(ButtonStyle.Primary),

				new ButtonBuilder()
					.setCustomId(`growscan|${world}|${page}|next|${private}|${user_id}`)
					.setLabel("➡️")
					.setDisabled(page >= maxPage ? true : false)
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId(`delete|${user_id}`).setLabel("Delete Message").setDisabled(false).setStyle(ButtonStyle.Danger),
			);

			await interaction.update({
				embeds: [embed],
				components: [row],
			});
		} catch (e) {
			console.log(e);
		}
	},
};
