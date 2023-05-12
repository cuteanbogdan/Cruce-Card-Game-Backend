const Game = require('./schemas/Game');
const User = require('./schemas/User');

module.exports = {
    createGame: async (socket, io, data) => {
        let game = new Game();
        let user = await User.findOne({ _id: data._id });
        game.players.push(user._id);
        await game.save();

        socket.join(game._id);
        socket.emit('gameCreated', { gameId: game._id });
        io.emit('gamesList', module.exports.getAllGames());
    },
    joinGame: async (socket, io, data) => {
        let user = await User.findOne({ _id: data._id });

        // Check if the user is already participating in any games
        let activeGame = await Game.findOne({ players: user._id });
        if (activeGame) {
            socket.emit('error', { message: 'You are already participating in a game' });
            return;
        }

        let game = await Game.findById(data.gameId);
        if (game && game.players.length < 2) {
            game.players.push(user._id);
            await game.save();

            socket.join(game._id);
            socket.emit('gameJoined', { gameId: game._id });
            io.emit('gamesList', module.exports.getAllGames());
        } else {
            socket.emit('error', { message: 'Unable to join game' });
        }
    },
    getAllGames: async () => {
        let games = await Game.find({ players: { $size: 1 } });
        console.log(games)
        return games;
    },
};

