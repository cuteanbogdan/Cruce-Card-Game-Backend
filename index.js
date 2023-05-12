const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./db")
const gameManager = require('./gameManager');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 5000;
const http = require('http');
const cors = require('cors')
const usersRoutes = require('./routes/usersRoutes');
const passport = require('passport');
require('./passport');

dotenv.config();
connectDB()

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND,
        methods: ["GET", "POST"],
        credentials: false
    },
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: process.env.FRONTEND,
        credentials: false,
    })
);
app.use(passport.initialize());



app.get('/', (req, res) => {
    res.send('Welcome to Cruce Game API!');
});

app.use('/api/users', usersRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('connect_error', (error) => {
        console.log('Connection Error: ', error);
    });

    socket.on('error', (error) => {
        console.log('Error: ', error);
    });
    (async () => {
        const games = await gameManager.getAllGames();
        socket.emit('gamesList', games);
    })();

    socket.on('createGame', (data) => {
        gameManager.createGame(socket, io, data);
    });

    socket.on('joinGame', (data) => {
        gameManager.joinGame(socket, io, data);
    });
    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected due to: ${reason}`);
    });

});

server.listen(PORT, () => console.log(`Server listening on port:${PORT} `));
