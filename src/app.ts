import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/user.routes';
import AddressRoutes from './routes/address.routes';
import ShopRoutes from './routes/shop.routes';
import ItemRoutes from './routes/item.routes';
import CustomerRoutes from './routes/customer.routes';
import GeneralCategoryRoutes from './routes/generalCategory.routes';
import ItemCategoryRoutes from './routes/itemCategory.routes';
import QrCodeRoutes from './routes/qrCode.routes';
import OrderRoutes from './routes/order.routes';
import { errorMiddleware } from './middleware/error';
import verifyToken from './middleware/verifyToken';
import swaggerDocs from './utils/swagger';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

// Msg teste para rota padrão
app.get('/', (req, res) => {
  return res.send({ message: 'Bom dia' });
});

app.get('/docs/swaggerjs', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), './src/utils/swaggerUi.js'));
});

app.get('/docs/favicon', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), './src/utils/favicon.ico'));
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
swaggerDocs(app, Number(PORT));

app.use(verifyToken());

// Configurando rotas
app.use('/user', UserRoutes);
app.use('/address', AddressRoutes);
app.use('/shop', ShopRoutes);
app.use('/item', ItemRoutes);
app.use('/customer', CustomerRoutes);
app.use('/generalcategory', GeneralCategoryRoutes);
app.use('/itemcategory', ItemCategoryRoutes);
app.use('/qrcode', QrCodeRoutes);
app.use('/order', OrderRoutes);

// Middleware para tratamento de erros
app.use(errorMiddleware);

export default app;
