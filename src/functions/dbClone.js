const ticketModel = require('../schemas/ticket');
const buyerModel = require('../schemas/buyer');
const carrierModel = require('../schemas/carrier');

module.exports = (client) => {
    client.dbClone = async () => {
        const ticketObjects = await ticketModel.find().catch((err) => console.log(err));
        const buyerObjects = await buyerModel.find().catch((err) => console.log(err));
        const carrierObjects = await carrierModel.find().catch((err) => console.log(err));

        for ( let i = 0; i < ticketObjects.length; ++i ) {
            const {channelID, ign, buyer, carrierRoleID, claimerID, questionNumber, floor, price, quantity, tier, type, score} = ticketObjects[i];
            client.tickets.set(channelID, { ign: ign, carrierRoleID: carrierRoleID, buyer: buyer, claimerID: claimerID, floor: floor, tier: tier, type: type, price: price, quantity: quantity, score: score, questionNumber: questionNumber });
        }
        for ( let i = 0; i < buyerObjects.length; ++i ) {
            const { buyerID, channelId } = buyerObjects[i];
            client.buyers.set(buyerID, { channel: channelId });
        }
        for ( let i = 0; i < carrierObjects.length; ++i ) {
            const { discordID, carrierScore } = carrierObjects[i];
            client.carriers.set(discordID, { carrierScore: carrierScore });
        }
    };
};