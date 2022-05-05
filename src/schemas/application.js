const mongoose = require ('mongoose');

const submitSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    ign: String, 
    skycrypt: String,
    speedProof: String,
    floor: String, 
    tier: String, 
    userID: Number,
    appType: String
});

const submitModel = mongoose.model('application', submitSchema);

module.exports = submitModel;