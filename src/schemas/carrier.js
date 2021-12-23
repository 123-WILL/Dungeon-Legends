const mongoose = require ('mongoose');

const carrierSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    carrierScore: Number
});

const carrierModel = mongoose.model('carrier', carrierSchema);

module.exports = carrierModel;