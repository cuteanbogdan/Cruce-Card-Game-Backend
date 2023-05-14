const Game = require('./schemas/Game');  // Replace with the correct path to your Game model
const User = require('./schemas/User');  // Replace with the correct path to your User model

const gameLogic = (io) => {
    io.on('connection', (socket) => {
        // User wants to start the bid
        socket.on('startBid', async (data) => {
            console.log('startBid event received', data);
            const game = await Game.findById(data.gameId);
            // Check if it's the user's turn and they haven't already placed a bid
            if (game.turn === 0 && game.currentBidder === null) {
                game.currentBidder = data.userId;
                await game.save();
                console.log(game.currentBidder)
                io.emit('bidStarted', game);
            } else {
                socket.emit('error', { message: 'It\'s not your turn to start the bid.' });
            }
        });

        // User wants to place a bid
        socket.on('placeBid', async (data) => {
            const game = await Game.findById(data.gameId);
            // Check if it's the user's turn and they are the current bidder
            if (game.turn === game.players.indexOf(data.userId) && game.currentBidder.equals(data.userId)) {
                if (data.bid > game.currentBid) {
                    // If the bid is higher than the current bid, update the current bid
                    game.currentBid = data.bid;
                    // Pass the turn to the next player
                    game.turn = (game.turn + 1) % game.players.length;
                    game.currentBidder = game.players[game.turn];
                    await game.save();
                    io.emit('bidPlaced', game);
                } else {
                    socket.emit('error', { message: 'Your bid must be higher than the current bid.' });
                }
            } else {
                socket.emit('error', { message: 'It\'s not your turn to place a bid.' });
            }
        });

        socket.on('playCard', async (data) => {
            // Fetch the game from the DB
            const game = await Game.findById(data.gameId);

            // Implement your game logic here...
            // For example, add the card to the current trick, check if the trick is complete, etc.

            // End turn logic
            game.turn = (game.turn + 1) % game.players.length;  // Assumes players.length is the total number of players

            // Don't forget to save the updated game state to the DB
            await game.save();

            // Send the updated game state to all clients
            io.emit('gameUpdate', game);
        });


        // A user wants to end their turn
        socket.on('endTurn', async (data) => {
            const game = await Game.findById(data.gameId);

            // Implement your game logic here...

            await game.save();
            io.emit('gameUpdate', game);
        });

        // A user wants to end the game
        socket.on('endGame', async (data) => {
            const game = await Game.findById(data.gameId);

            // Implement your game logic here...

            await game.save();
            io.emit('gameUpdate', game);
        });
    });
};

module.exports = gameLogic;
