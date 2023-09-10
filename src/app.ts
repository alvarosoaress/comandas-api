import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/user.routes';
import AddressRoutes from './routes/address.routes';
import ShopRoutes from './routes/shop.routes';
import ItemRoutes from './routes/item.routes';
import { errorMiddleware } from './middleware/error';

const app = express();

app.use(cors());
app.use(express.json());

// Msg teste para rota padrão
app.get('/', (req, res) => {
  return res.send({ message: 'Bom dia' });
});

// Configurando rotas
app.use('/user', UserRoutes);

// TODO Criar endPoint update para Address e Shop

app.use('/address', AddressRoutes);
app.use('/shop', ShopRoutes);
app.use('/item', ItemRoutes);

// Middleware para tratamento de erros
app.use(errorMiddleware);

export default app;
