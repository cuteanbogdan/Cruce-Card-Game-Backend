const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    active: { type: Boolean, default: true },
    turn: { type: Number, default: 0 },
    bids: [Number],
    tricks: [[{ type: Schema.Types.ObjectId, ref: 'Card' }]],
    scores: [Number]
});

module.exports = mongoose.model('Game', GameSchema);
