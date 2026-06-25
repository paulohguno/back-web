import './env.js';
import { Sequelize } from 'sequelize';

const connectionUri = process.env.DATABASE_URL?.trim();
const useSsl = ['true', '1', 'yes'].includes((process.env.DB_SSL || '').toLowerCase());

const commonOptions = {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  dialectOptions: useSsl ? {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessário para certificados autoassinados do Render
    }
  } : {},
};

export const sequelize = connectionUri
  ? new Sequelize(connectionUri, commonOptions)
  : new Sequelize(
      process.env.POSTGRES_DB || 'restaurante_db',
      process.env.POSTGRES_USERNAME || 'postgres',
      process.env.POSTGRES_PASSWORD || '1234',
      {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5433),
        ...commonOptions,
      }
    );

export default sequelize;