// configManager.js
const fs = require("fs");
const path = require("path");

class ConfigManager {
	constructor(options = {}) {
		this.configPath = options.configPath || path.join(__dirname, "config.json");
		this.defaultConfig = options.defaultConfig || {};
		this.encoding = options.encoding || "utf8";
		this.cache = null;
	}

	// Baca config dari file
	read() {
		try {
			// Cek apakah file exists
			if (!fs.existsSync(this.configPath)) {
				// Buat file baru dengan default config
				this.write(this.defaultConfig);
				return this.defaultConfig;
			}

			// Baca file
			const data = fs.readFileSync(this.configPath, this.encoding);
			return JSON.parse(data);
		} catch (error) {
			console.error("Error reading config:", error);
			return this.defaultConfig;
		}
	}

	// Tulis config ke file
	write(data) {
		try {
			// Pastikan direktori exists
			const dir = path.dirname(this.configPath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			// Tulis file dengan format JSON yang rapi
			fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2), this.encoding);

			// Update cache
			this.cache = data;

			return true;
		} catch (error) {
			console.error("Error writing config:", error);
			return false;
		}
	}

	// Get value by key (dot notation supported)
	get(key, defaultValue = null) {
		const config = this.getAll();

		if (!key) return config;

		// Support nested keys (contoh: "database.host")
		const keys = key.split(".");
		let value = config;

		for (const k of keys) {
			if (value && typeof value === "object" && k in value) {
				value = value[k];
			} else {
				return defaultValue;
			}
		}

		return value !== undefined ? value : defaultValue;
	}

	// Set value by key
	set(key, value) {
		const config = this.getAll();

		// Support nested keys
		const keys = key.split(".");
		let current = config;

		for (let i = 0; i < keys.length - 1; i++) {
			const k = keys[i];
			if (!current[k] || typeof current[k] !== "object") {
				current[k] = {};
			}
			current = current[k];
		}

		current[keys[keys.length - 1]] = value;

		return this.write(config);
	}

	// Update multiple values
	update(updates) {
		const config = this.getAll();

		for (const [key, value] of Object.entries(updates)) {
			const keys = key.split(".");
			let current = config;

			for (let i = 0; i < keys.length - 1; i++) {
				const k = keys[i];
				if (!current[k] || typeof current[k] !== "object") {
					current[k] = {};
				}
				current = current[k];
			}

			current[keys[keys.length - 1]] = value;
		}

		return this.write(config);
	}

	// Delete key
	delete(key) {
		const config = this.getAll();
		const keys = key.split(".");
		let current = config;

		for (let i = 0; i < keys.length - 1; i++) {
			const k = keys[i];
			if (!current[k] || typeof current[k] !== "object") {
				return false; // Key not found
			}
			current = current[k];
		}

		delete current[keys[keys.length - 1]];
		return this.write(config);
	}

	// Get all config
	getAll() {
		if (this.cache) return this.cache;
		this.cache = this.read();
		return this.cache;
	}

	// Reset to default
	reset() {
		this.cache = this.defaultConfig;
		return this.write(this.defaultConfig);
	}

	// Check if key exists
	has(key) {
		return this.get(key) !== null;
	}

	// Get all keys
	keys() {
		return Object.keys(this.getAll());
	}

	// Get config size
	size() {
		return Object.keys(this.getAll()).length;
	}

	// Merge with another config
	merge(newConfig) {
		const current = this.getAll();
		const merged = { ...current, ...newConfig };
		return this.write(merged);
	}

	// Watch for file changes (optional)
	watch(callback) {
		fs.watch(this.configPath, eventType => {
			if (eventType === "change") {
				this.cache = null; // Clear cache
				if (callback) callback(this.getAll());
			}
		});
	}
}

// Export instance dengan default config
module.exports = new ConfigManager({
	defaultConfig: {
		growscan: {
			ownerId: "9999",
            growscanChannel: "3333",
            isBotOnline: false,
		},
	},
});
