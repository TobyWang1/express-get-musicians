const express = require("express");
const app = express();
const { Musician, Band } = require("../models/index")
const { db } = require("../db/connection")

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians 

app.get('/musicians', async (request, response) => {
    try {
        const musicians = await Musician.findAll();
        // Send the response with the data in JSON format
        response.json(musicians);
    } catch (error) {
        response.status(500).json({ error: "Failed to retrieve musicians" });
    }
})

app.get('/bands', async (request, response) => {
    try {
        const bands = await Band.findAll();
        // Send the response with the data in JSON format
        response.json(bands);
    } catch (error) {
        response.status(500).json({ error: "Failed to retrieve bands" });
    }
})

module.exports = app;