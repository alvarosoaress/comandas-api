import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/user.routes';
import AddressRoutes from './routes/address.routes';
import ShopRoutes from './routes/shop.routes';
import { errorMiddleware } from './middleware/error';

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
app.use('/address', AddressRoutes);
app.use('/shop', ShopRoutes);

// Middleware para tratamento de erros
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);
});
