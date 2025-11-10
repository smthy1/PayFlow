import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";


await app.ready();

await app.listen({ port: PORT, host: HOST });