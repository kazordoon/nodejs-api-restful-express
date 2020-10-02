require('dotenv').config();
const express = require('express');
const cors = require('cors');
const consign = require('consign');

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

consign({ cwd: 'src/app', verbose: false })
  .then('models')
  .then('controllers')
  .then('middlewares')
  .then('schemas')
  .then('routes')
  .into(app);

const { courseRoutes, authRoutes } = app.routes;

app.use('/courses', courseRoutes);
app.use('/auth', authRoutes);

const { notFound, handleErrors } = app.middlewares.errors;

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.set('PORT', PORT);

module.exports = app;