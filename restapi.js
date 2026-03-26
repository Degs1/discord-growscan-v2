const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/tes", async (req, res) => {
	console.log(req.body);

	await res.json({
		status: true,
		scanned: [
			{
				tipe: "floating",
				count: 100,
				name: "cloud_berry",
			},
			{
				tipe: "block",
				count: 100,
				name: "stone_brick",
			},
			{
				tipe: "floating",
				count: 100,
				name: "dandelion_puff",
			},
			{
				tipe: "block",
				count: 100,
				name: "oak_log",
			},
			{
				tipe: "floating",
				count: 100,
				name: "bubble_tea",
			},
			{
				tipe: "block",
				count: 100,
				name: "cobblestone",
			},
			{
				tipe: "floating",
				count: 100,
				name: "feather_light",
			},
			{
				tipe: "block",
				count: 100,
				name: "iron_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "marshmallow_cloud",
			},
			{
				tipe: "block",
				count: 100,
				name: "diamond_ore",
			},
			{
				tipe: "floating",
				count: 100,
				name: "soap_bubble",
			},
			{
				tipe: "block",
				count: 100,
				name: "netherrack",
			},
			{
				tipe: "floating",
				count: 100,
				name: "balloon_animal",
			},
			{
				tipe: "block",
				count: 100,
				name: "obsidian",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_leaf",
			},
			{
				tipe: "block",
				count: 100,
				name: "redstone_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "cotton_candy",
			},
			{
				tipe: "block",
				count: 100,
				name: "emerald_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "angel_feather",
			},
			{
				tipe: "block",
				count: 100,
				name: "lapis_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_flower",
			},
			{
				tipe: "block",
				count: 100,
				name: "gold_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "bubble_wrap",
			},
			{
				tipe: "block",
				count: 100,
				name: "coal_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_butterfly",
			},
			{
				tipe: "block",
				count: 100,
				name: "quartz_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_feather",
			},
			{
				tipe: "block",
				count: 100,
				name: "purpur_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_petal",
			},
			{
				tipe: "block",
				count: 100,
				name: "end_stone",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_bubble",
			},
			{
				tipe: "block",
				count: 100,
				name: "prismarine",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_spore",
			},
			{
				tipe: "block",
				count: 100,
				name: "sea_lantern",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_cloud",
			},
			{
				tipe: "block",
				count: 100,
				name: "sponge",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_dream",
			},
			{
				tipe: "block",
				count: 100,
				name: "wet_sponge",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_mist",
			},
			{
				tipe: "block",
				count: 100,
				name: "magma_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_fog",
			},
			{
				tipe: "block",
				count: 100,
				name: "soul_sand",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_ash",
			},
			{
				tipe: "block",
				count: 100,
				name: "glowstone",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_spark",
			},
			{
				tipe: "block",
				count: 100,
				name: "shroomlight",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_glow",
			},
			{
				tipe: "block",
				count: 100,
				name: "honey_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_pollen",
			},
			{
				tipe: "block",
				count: 100,
				name: "slime_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_fairy",
			},
			{
				tipe: "block",
				count: 100,
				name: "target_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_stardust",
			},
			{
				tipe: "block",
				count: 100,
				name: "observer_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_memory",
			},
			{
				tipe: "block",
				count: 100,
				name: "piston_block",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_thought",
			},
			{
				tipe: "block",
				count: 100,
				name: "sticky_piston",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_idea",
			},
			{
				tipe: "block",
				count: 100,
				name: "dropper",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_inspiration",
			},
			{
				tipe: "block",
				count: 100,
				name: "dispenser",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_muse",
			},
			{
				tipe: "block",
				count: 100,
				name: "hopper",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_whisper",
			},
			{
				tipe: "block",
				count: 100,
				name: "observer",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_echo",
			},
			{
				tipe: "block",
				count: 100,
				name: "comparator",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_sound",
			},
			{
				tipe: "block",
				count: 100,
				name: "repeater",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_melody",
			},
			{
				tipe: "block",
				count: 100,
				name: "redstone_torch",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_harmony",
			},
			{
				tipe: "block",
				count: 100,
				name: "lever",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_rhythm",
			},
			{
				tipe: "block",
				count: 100,
				name: "button",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_beat",
			},
			{
				tipe: "block",
				count: 100,
				name: "pressure_plate",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_poem",
			},
			{
				tipe: "block",
				count: 100,
				name: "tripwire_hook",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_verse",
			},
			{
				tipe: "block",
				count: 100,
				name: "rail",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_story",
			},
			{
				tipe: "block",
				count: 100,
				name: "powered_rail",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_tale",
			},
			{
				tipe: "block",
				count: 100,
				name: "detector_rail",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_legend",
			},
			{
				tipe: "block",
				count: 100,
				name: "activator_rail",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_myth",
			},
			{
				tipe: "block",
				count: 100,
				name: "minecart",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_fable",
			},
			{
				tipe: "block",
				count: 100,
				name: "chest_minecart",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_parable",
			},
			{
				tipe: "block",
				count: 100,
				name: "furnace_minecart",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_allegory",
			},
			{
				tipe: "block",
				count: 100,
				name: "tnt_minecart",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_metaphor",
			},
			{
				tipe: "block",
				count: 100,
				name: "hopper_minecart",
			},
			{
				tipe: "floating",
				count: 100,
				name: "floating_simile",
			},
		],
	});
});

module.exports = app;
