const mongoose = require ('mongoose');

const submitSchema = new mongoose.Schema ({
    _id: String,
    userID: String,
    appType: String,
    messageID: Number
});

const submitModel = mongoose.model('application', submitSchema);

module.exports = submitModel;