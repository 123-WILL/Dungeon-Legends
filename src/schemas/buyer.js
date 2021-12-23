const mongoose = require ('mongoose');

const buyerSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    buyerID: String,
    channelId: String
});

const buyerModel = mongoose.model('buyer', buyerSchema);

module.exports = buyerModel;