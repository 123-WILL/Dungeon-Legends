const mongoose = require ('mongoose');

const whitelistedSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    ign: String
});

const whitelistedModel = mongoose.model('whitelisted', whitelistedSchema);

module.exports = whitelistedModel;