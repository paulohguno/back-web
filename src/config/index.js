import './env.js';
import { Sequelize } from 'sequelize';

// Suporta DATABASE_URL (string completa) ou variáveis separadas DB_*
const connectionUri = process.env.DATABASE_URL?.trim();

// SSL obrigatório no Render
const useSsl = !['false', '0', 'no'].includes((process.env.DB_SSL || '').toLowerCase());

const commonOptions = {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // necessário para certificados do Render
    },
  },
};

export const sequelize = connectionUri
  ? new Sequelize(connectionUri, commonOptions)
  : new Sequelize(
      process.env.DB_NAME || 'roda_sabor_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        ...commonOptions,
      }
    );

export default sequelize;
