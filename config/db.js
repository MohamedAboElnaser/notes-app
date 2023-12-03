require('dotenv').config();

if (process.env.NODE_ENV == 'testing') {
  Object.assign(process.env, {
    DATABASE_URL: process.env.TESTING_DB,
  });
  console.log('Connected to testing DB..');
} else if (process.env.NODE_ENV == 'production') {
  Object.assign(process.env, {
    DATABASE_URL: process.env.PRODUCTION_DB,
  });
  console.log('Connected to production DB..');
} else console.log('connected to development db');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = db;
