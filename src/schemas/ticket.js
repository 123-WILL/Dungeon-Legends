const mongoose = require ('mongoose');

const ticketSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    channelID: String,
    ign: String, 
    carrierRoleID: String, 
    buyer: String, 
    claimerID: String, 
    floor: Number, 
    tier: Number, 
    type: String, 
    price: Number, 
    quantity: Number, 
    score: String, 
    questionNumber: Number
});

const ticketModel = mongoose.model('ticket', ticketSchema);

module.exports = ticketModel;