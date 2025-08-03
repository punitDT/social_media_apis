import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';

/// import dotenv
import dotenv from 'dotenv';
dotenv.config();

const basename = path.basename(__filename);
const db: any = {};

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'password',
  database: process.env.DATABASE_NAME || 'social_media_db',
  logging: false, // Disable logging to reduce noise
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');

    // Load models only if database connection is successful
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
        try {
          const modelImport = await import(path.join(__dirname, file));
          const model = modelImport.default(sequelize, DataTypes);
          db[model.name] = model;
        } catch (error) {
          console.log(`Error loading model ${file}:`, error);
        }
      });
  })
  .catch((error) => {
    console.log('Unable to connect to the database. API will run without database functionality:', error.message);
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
