import express from 'express';
import { ObterCursosTareas } from './index.js';
import fetch from 'node-fetch';
import { fetchData } from './gpt-api.js';
import cors from 'cors'; // Importa el módulo 'cors'

const app = express();
const puerto = 3001;

// Utiliza el middleware cors
app.use(cors());

app.get('/obtener-cursos-tareas', async (req, res) => {
  try {
    const { user, pass } = req.query;
    const resultados = await ObterCursosTareas(user, pass);
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/consumir-api-openai', async (req, res) => {
  try {
    const { apiKey, prompt } = req.query;
    const resultados = await fetchData(apiKey, prompt);
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor al consumir la API de OpenAI');
  }
});

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
