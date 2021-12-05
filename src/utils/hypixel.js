const HypixelAPIReborn = require('hypixel-api-reborn');
const hypixel = new HypixelAPIReborn.Client(process.env.apiKey, { cache: true });
const errors = HypixelAPIReborn.Errors

module.exports.hypixel = hypixel;
module.exports.errors = errors;