import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
/* Middlewares */
app.use(cors());
app.use(express.json());

/* Rutas */

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});