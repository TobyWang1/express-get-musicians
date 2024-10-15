const express = require("express");
const app = express();
const { Musician, Band } = require("../models/index")
const { db } = require("../db/connection")

const port = 3000;

app.use(express.json());
app.use(express.urlencoded()); 

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

app.get('/musicians/:id', async (req, res) => {
    try {
        const musician = await Musician.findByPk(req.params.id);
        if (musician) {
            res.json(musician);
        } else {
            res.status(404).json({ message: "Musician not found" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid musician ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

app.post('/musicians/add', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const musician = await Musician.create(req.body);
        res.status(201).json(musician); // Successfully created
    } catch (error) {
        console.error(error); // Log error for debugging

        if (error instanceof ValidationError) {
            res.status(400).json({ message: "Invalid input data" });
        } else if (error instanceof UniqueConstraintError) {
            res.status(409).json({ message: "Musician already exists" });
        } else if (error instanceof ForeignKeyConstraintError) {
            res.status(400).json({ message: "Invalid foreign key reference" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

app.put('/musicians/update/:id', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        
        const musician = await Musician.findByPk(req.params.id);
        musician.update(req.body);
        res.status(201).json(musician);
    } catch(error) {
        console.error(error); // Log error for debugging

        if (error instanceof ValidationError) {
            res.status(400).json({ message: "Invalid input data" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
})

app.delete('/musicians/delete/:id', async (req, res) => {
    try {
        const musician = await Musician.findByPk(req.params.id);
        if (musician) {
            musician.destroy();
            res.status(201).send('Successfully deleted the musician'); // Successfully deleted
        } else {
            res.status(404).json({ message: "Musician not found" });
        }
    } catch(error) {
        console.error(error); // Log the error for debugging

        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid musician ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
})

module.exports = app;