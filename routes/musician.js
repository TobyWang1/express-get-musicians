const express = require('express');
const router = express.Router();
const { Musician } = require('../models/index');

router.get('/musicians', async (req, res) => {
    try {
        const musicians = await Musician.findAll();
        res.json(musicians);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/musicians/:id', async (req, res) => {
    try {
        const musician = await Musician.findByPk(req.params.id);
        if (musician) {
            res.json(musician);
        } else {
            res.status(404).json({ message: "Musician not found" });
        }
    } catch (error) {
        console.error(error);
        if (error instanceof SomeValidationError) {
            res.status(400).json({ message: "Invalid musician ID" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.post('/musicians/add', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const musician = await Musician.create(req.body);
        res.status(201).json(musician);
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            res.status(400).json({ message: "Invalid musician data" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
})

router.put('/musicians/update/:id', async (req, res) => {
    try {
        const musician = await Musician.findByPk(req.params.id);
        if (musician) {
            await musician.update(req.body);
            res.json(musician);
        } else {
            res.status(404).json({ message: "Musician not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/musicians/delete/:id', async (req, res) => {
    try {
        const musician = await Musician.findByPk(req.params.id);
        if (musician) {
            await musician.destroy();
            res.json({ message: "Musician deleted" });
        } else {
            res.status(404).json({ message: "Musician not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;