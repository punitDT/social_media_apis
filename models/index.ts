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

// Initialize database connection and models
const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Load models
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

    // Wait a bit for models to load, then sync
    setTimeout(async () => {
      try {
        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');
      } catch (error) {
        console.error('Error synchronizing database:', error);
      }
    }, 1000);

  } catch (error) {
    console.log('Unable to connect to the database. API will run without database functionality:', error instanceof Error ? error.message : error);
  }
};

// Initialize database
initializeDatabase();

// This must be called **after** all models are loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
