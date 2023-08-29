import express from 'express'
import cors from 'cors'
import UserRoutes from './routes/user.routes'

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8000;

// Msg teste para rota padrão
app.get('/', (req, res) => {
  return res.send({ message: 'Bom dia' });
});

// Configurando rotas
app.use('/user', UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`)
});
