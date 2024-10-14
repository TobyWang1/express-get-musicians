// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician, Band } = require('./models/index')
const app = require('./src/app');
const { seedMusician, seedBand } = require("./seedData");
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')


describe('./musicians endpoint', () => {
    beforeAll(async () => {
        // Re-sync the database before running tests
        await db.sync({ force: true });
        // Seed data into the Musician model
        await Musician.bulkCreate(seedMusician);
        await Band.bulkCreate(seedBand);
    });
    
    afterAll(async () => {
        // Close the database connection after the tests are done
        await db.close();
    });
    
    describe("GET /musicians", () => {
        it("should return a 200 status and all musicians", async () => {
            const response = await request(app).get("/musicians");
    
            // Check status code
            expect(response.statusCode).toBe(200);
    
            // Check if the response contains all musicians
            expect(response.body.length).toBe(seedMusician.length);
    
            // Check if the first musician's name matches the seed data
            expect(response.body[0].name).toBe(seedMusician[0].name);
        });
    
        it("should return the correct instrument for a musician", async () => {
            const response = await request(app).get("/musicians");
    
            // Check if the instrument of the first musician is as expected
            expect(response.body[0].instrument).toBe(seedMusician[0].instrument);
        });
    });

    describe("GET /bands", () => {
        it("should return a 200 status and all bands", async () => {
            const response = await request(app).get("/bands");
    
            // Check status code
            expect(response.statusCode).toBe(200);
    
            // Check if the response contains all bands
            expect(response.body.length).toBe(seedBand.length);
    
            // Check if the first band's name matches the seed data
            expect(response.body[0].name).toBe(seedBand[0].name);
        });
    
        it("should return the correct genre for a band", async () => {
            const response = await request(app).get("/bands");
    
            // Check if the genre of the first band is as expected
            expect(response.body[0].genre).toBe(seedBand[0].genre);
        });
    });
})

