import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import UserRoutes from './routes/user'

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({ path: path.resolve('./.env') }); // configurando para uso do arquivo .ENV

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
