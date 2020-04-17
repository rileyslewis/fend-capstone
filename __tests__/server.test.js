const request = require("supertest");
const app = require("../src/server/server.js");

describe("Testing Root path", () => {
    test("response provides GET method", async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});