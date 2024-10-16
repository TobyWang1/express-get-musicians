const express = require('express');
const router = express.Router();
const { Band, Musician } = require('../models/index');

router.get('/bands', async (req, res) => {
    try {
        const bands = await Band.findAll(
            {
                include: Musician
            }
        );
        res.json(bands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findByPk(req.params.id, {
            include: Musician
        });
        if (band) {
            res.json(band);
        } else {
            res.status(404).json({ message: "Band not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;