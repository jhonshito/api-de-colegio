const { urlencoded } = require("express");
const express = require("express");
require('dotenv').config();
require('./database/conexion');
const cors = require("cors")
const app = express();


app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use('/', require('./routers/home.router'));

app.listen(4000, console.log('servidor andando'))