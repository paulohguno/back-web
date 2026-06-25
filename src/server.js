import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import './config/env.js';
import { syncModels } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import * as usuarioController from './controllers/usuarioController.js';
import enderecosRoutes from './routes/enderecosRoutes.js';
import cartoesRoutes from './routes/cartoesRoutes.js';
import pagamentosRoutes from './routes/pagamentosRoutes.js';
import itemPedidosRoutes from './routes/itemPedidosRoutes.js';
import premiosUsuarioRoutes from './routes/premiosUsuarioRoutes.js';
import transacoesPontosRoutes from './routes/transacoesPontosRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import roletaRoutes from './routes/roletaRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import pontosRoutes from './routes/pontosRoutes.js';
import { garantirSeedInicial } from './database/bootstrapSeed.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const porta = process.env.PORT || 3333;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', projeto: 'Roda & Sabor' });
});

app.post('/api/usuarios/register', usuarioController.criar);
app.post('/usuarios/register', usuarioController.criar);

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/api/enderecos', enderecosRoutes);
app.use('/api/cartoes', cartoesRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/item-pedidos', itemPedidosRoutes);
app.use('/api/premios-usuario', premiosUsuarioRoutes);
app.use('/api/transacoes-pontos', transacoesPontosRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/roleta', roletaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pontos', pontosRoutes);

app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) return notFound(req, res);
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await syncModels();
    await garantirSeedInicial();

    app.listen(porta, () => {
      console.log(`Servidor rodando na porta ${porta}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor. Confira o PostgreSQL e o arquivo .env.');
    console.error(error);
    process.exit(1);
  }
};

startServer();