const mongoose = require('mongoose');


const worldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scanned: { type: Array, default: [] },
});

const World = mongoose.model('World', worldSchema);
module.exports = World;