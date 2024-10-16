const { Musician, Band } = require("./models/index")
const { db } = require("./db/connection");
const { seedMusician, seedBand } = require("./seedData");

const syncSeed = async () => {
    await db.sync({force: true});
    seedBand.map(band => Band.create(band));
    // Create musicians and associate them with the corresponding bands
    const bands = await Band.findAll();
    const seedMusiciansWithBandId = seedMusician.map((musician, index) => {
        return { ...musician, bandId: bands[index % bands.length].id };
    });
    await Musician.bulkCreate(seedMusiciansWithBandId);
}

syncSeed();