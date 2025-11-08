import app from "./app.js";


const PORT = process.env.PORT;

app.listen({ port: Number(PORT) }, (err, address ) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando na porta ${address}`);
});