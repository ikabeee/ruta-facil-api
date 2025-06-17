import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('API Ruta Fácil funcionando con TypeScript!');
});

export default app;
