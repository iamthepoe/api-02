import express from 'express';
import { configDotenv } from 'dotenv';
import process from 'process';
import mongoose from 'mongoose';
import { CreateUserController } from '../factories/user.factory.js';
import { CreateAuthController } from '../factories/auth.factory.js';
import cors from 'cors';
configDotenv();

export default class SetupServer {
  /**
   * @type {Server}
   * @private
   */
  server;

  /**
   *
   * @param {Express} app
   * @param {number} port
   */
  constructor(
    app = express(),
    port = process.env.SERVER_PORT || 3000,
    userController = CreateUserController(),
    authController = CreateAuthController()
  ) {
    /**@private*/
    this.app = app;
    /**@private*/
    this.port = port;
    /**@private */
    this.userController = userController;
    /**@private */
    this.authController = authController;
  }

  init() {
    return new Promise((resolve, reject) => {
      try {
        this.setupDatabase();
        this.setupExpress();
        this.setupMiddlewares();
        this.setupRoutes();
        this.server = this.app.listen(this.port, () => {
          console.log('Server is running.');
          resolve();
        });
      } catch (e) {
        reject({ message: 'Error at initialize', exception: e });
      }
    });
  }

  async close() {
    await this.closeDatabase();
    return this.server.close();
  }

  /**
   * @private
   */
  setupExpress() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  /**
   * @private
   */
  setupMiddlewares() {
    this.app.use('/user', (req, res, next) => {
      this.authController.authorize(req, res, next);
    });
  }

  /**
   * @private
   */
  setupRoutes() {
    this.app.get('/user', (req, res) => {
      return this.userController.findByToken(req, res);
    });

    this.app.post('/sign-up', (req, res) => {
      return this.userController.create(req, res);
    });

    this.app.post('/sign-in', (req, res) => {
      return this.authController.signIn(req, res);
    });

    // 404 Route
    this.app.use((req, res) => {
      res.status(404).json({ message: 'Not Found' });
    });
  }

  /**
   * @private
   */
  setupDatabase() {
    mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => {
        console.log('Database Connected.');
      })
      .catch((e) => {
        console.log('Error when connecting in database', e);
      });
  }

  /**@private */
  closeDatabase() {
    return mongoose.disconnect();
  }
}
