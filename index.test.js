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


describe('Endpoint tests', () => {
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

    describe('POST /musicians/add', () => {
        it('should return a 201 status and the newly added musician', async () => {
            const newMusician = {
                name: 'John Doe',
                instrument: 'Guitar'
            };
    
            const response = await request(app)
                .post('/musicians/add')
                .send(newMusician);
    
            // Check status code
            expect(response.statusCode).toBe(201);
    
            // Check if the response contains the newly added musician
            expect(response.body.name).toBe(newMusician.name);
            expect(response.body.instrument).toBe(newMusician.instrument);
        });
    
        it('should return a 400 status if the request body is missing required fields', async () => {
            const response = await request(app)
                .post('/musicians/add')
                .send({
                    name: 'John Doe'
                });
    
            // Check status code
            expect(response.statusCode).toBe(400);
    
            // Check if the response contains the validation error
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('PUT /musicians/update/:id', () => {
        it('should return a 200 status and the updated musician', async () => {
            const updatedMusician = {
                name: 'Jane Doe',
                instrument: 'Piano'
            };
    
            const response = await request(app)
                .put('/musicians/update/1')
                .send(updatedMusician);
    
            // Check status code
            expect(response.statusCode).toBe(200);
    
            // Check if the response contains the updated musician
            expect(response.body.name).toBe(updatedMusician.name);
            expect(response.body.instrument).toBe(updatedMusician.instrument);
        });
    
        it('should return a 404 status if the musician is not found', async () => {
            const response = await request(app)
                .put('/musicians/update/100')
                .send({
                    name: 'Jane Doe',
                    instrument: 'Piano'
                });
    
            // Check status code
            expect(response.statusCode).toBe(404);
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

