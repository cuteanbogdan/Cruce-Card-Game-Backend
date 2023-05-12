const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./db")

dotenv.config();
connectDB()

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Cruce Game API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
