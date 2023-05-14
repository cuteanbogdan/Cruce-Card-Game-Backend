const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    active: { type: Boolean, default: true },
    turn: { type: Schema.Types.ObjectId, ref: 'User' }, // Whose turn it is
    user1_score: { type: Number, default: 0 }, // Total score of user1
    user2_score: { type: Number, default: 0 }, // Total score of user2
    user1_points_this_turn: { type: Number, default: 0 }, // Points of user1 this turn
    user2_points_this_turn: { type: Number, default: 0 }, // Points of user2 this turn
    currentBid: { type: Number, default: 0 },
    currentBidder: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    tricks: [[{ type: Schema.Types.ObjectId, ref: 'Card' }]],
});


module.exports = mongoose.model('Game', GameSchema);
