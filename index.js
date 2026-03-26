const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb"); // Import MongoClient
const mongoose = require("mongoose"); // Import Mongoose
const World = require("./worldSchemas"); // Import the World model
const app = require("./restapi.js");
const config = require("./configManager");
const { Client, Collection, GatewayIntentBits, Events, REST, Routes, PresenceUpdateStatus } = require("discord.js"); // Import Discord.js components

const mongo_uri = config.get("growscan.mongo_uri"); // MongoDB connection URI
const token = config.get("growscan.token");

const bot_id = config.get("growscan.botID");
const server_id = config.get("growscan.serverID");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, "command");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
	const command = require(path.join(commandsPath, file));
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

const buttonHandlers = new Map();

const buttonFiles = fs.readdirSync("./buttons").filter(file => file.endsWith(".js"));

for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	buttonHandlers.set(button.name, button);
}

// Deploy slash command
const rest = new REST({ version: "10" }).setToken(token);

client.once(Events.ClientReady, async c => {
	console.log(`✅ Bot login sebagai ${c.user.tag}`);
	try {
		console.log("📡 Syncing slash commands...");
		await rest.put(
			Routes.applicationGuildCommands(bot_id, server_id), // ganti ke Routes.applicationCommands(bot_id) kalau global
			{ body: commands },
		);
		console.log("✅ Commands synced!");

		client.user.setPresence({
			status: config.get("growscan.isBotOnline") ? PresenceUpdateStatus.Online : PresenceUpdateStatus.DoNotDisturb,
		});
	} catch (err) {
		console.error("❌ Error sync commands:", err);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await interaction.deferReply({ flags: command.flags || undefined });
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: "something wrong!,please try again later", flags: true });
	}
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isButton()) return;

	const baseId = interaction.customId.split("|")[0];

	const handler = buttonHandlers.get(baseId);
	if (!handler) return;

	await handler.execute(interaction);
});

client.on("messageCreate", async message => {
	try {
		const text = message.content;
		const [command, status] = text.split("|");

		if (command == "degsgrowscan" && message.channel.id == config.get('growscan.statusChannel')) {
			const boolStatus = status == 1 ? true : false;
			if (config.has("growscan.isBotOnline")) {
				try {
					//const channel = await client.channels.fetch(config.get("growscan.growscanChannel"));
					if (config.get("growscan.isBotOnline") !== boolStatus) {
						config.set("growscan.isBotOnline", boolStatus);

						console.log(`trying to change status to ${boolStatus ? "-🟢" : "-🔴"}`);
						client.user.setPresence({
							status: boolStatus ? PresenceUpdateStatus.Online : PresenceUpdateStatus.DoNotDisturb,
						});
					}
				} catch (e) {
					console.log("failed change name status " + e);
				}
			} else {
				config.set("growscan.isBotOnline", boolStatus);
			}
		}
	} catch (e) {
		console.log("error while updating status bot :" + e);
	}
});

mongoose
	.connect(mongo_uri)
	.then(() => {
		console.log("Succes connecting to Mongo DB");
		client.login(token);
		//app.listen(api_port, () => console.log("api running on port", api_port));
	})
	.catch(err => console.error(err));
