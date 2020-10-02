require('dotenv').config();
const express = require('express');
const cors = require('cors');
const consign = require('consign');

class App {
  constructor() {
    this.express = express();

    this.loadSettings();
    this.loadMiddlewares();
    this.loadRoutes();
    this.handleRouteErrors();
  }

  loadSettings() {
    consign({ cwd: 'src/app', verbose: false })
      .then('models')
      .then('controllers')
      .then('middlewares')
      .then('schemas')
      .then('routes')
      .into(this.express);

    const PORT = process.env.PORT || 3000;
    this.express.set('PORT', PORT);
  }

  loadMiddlewares() {
    this.express.use(express.json());
    this.express.use(
      cors({
        origin: process.env.CORS_ORIGIN,
      }),
    );
  }

  loadRoutes() {
    const { courseRoutes, authRoutes } = this.express.routes;

    this.express.use('/courses', courseRoutes);
    this.express.use('/auth', authRoutes);
  }

  handleRouteErrors() {
    const { notFound, handleErrors } = this.express.middlewares.errors;

    this.express.use(notFound);
    this.express.use(handleErrors);
  }
}

module.exports = new App().express;