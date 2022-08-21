const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./config/dbConfig");

app.use(express.json());

const controllers = require("./routes/route");
app.use(controllers);



const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
})

db();