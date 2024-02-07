require('dotenv').config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const db = require('../config/db');

const app = express();

db.connect();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute);




const server = app.listen(process.env.PORT, ()=> {
    console.log(`Server started successfully on port ${process.env.PORT}`);
})
