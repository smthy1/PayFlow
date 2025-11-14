import request from 'supertest';
import app from "../app.js";
import { describe, it, beforeAll, afterAll, expect, jest } from '@jest/globals';
import { prisma } from '../modules/prisma/prisma.services.js';


let token: string;

beforeAll(async ()=> {
    await app.ready();

    const res = await request(app.server)
        .post('/auth/register')
        .send({ name: 'testtest',email: "test@test.com", password: "test1234" });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Usuário registrado");

    token = res.body.token;
});


describe('POST /health', ()=> {
    it("should return a message", async ()=> {
        const res = await request(app.server)
            .post('/health')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: "World!" });

        expect(res.status).toBe(200);
        expect(res.body.content).toBe("Hello World!");
    })
});

afterAll(async ()=> {
    await prisma.user.deleteMany({ where: { email: "test@test.com" } });
    await prisma.$disconnect();
    await app.close();
});