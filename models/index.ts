import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';

/// import dotenv
import dotenv from 'dotenv';
dotenv.config();

const basename = path.basename(__filename);
const db: any = {};

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' &&
      !file.endsWith('.test.ts')
    );
  })
  .forEach(async (file) => {
    const modelImport = await import(path.join(__dirname, file));
    const model = modelImport.default(sequelize, DataTypes);
    db[model.name] = model;
  });

// This must be called **after** all models are loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
