import app from "./app.js";
import 'dotenv/config';

const PORT = Number(process.env.PORT);



await app.ready();

await app.listen({ port: PORT, host: "0.0.0.0"  }, (err, adress) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Servidor rodando...");
});