const express = require("express");
const app = express();
const { Musician, Band } = require("../models/index")
const { db } = require("../db/connection")
const musicianRouter = require("../routes/musician")
const bandRouter = require("../routes/band")

const port = 3000;

app.use(express.json());
app.use(express.urlencoded()); 
app.use(musicianRouter);
app.use(bandRouter);

module.exports = app;