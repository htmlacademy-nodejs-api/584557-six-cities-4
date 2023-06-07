import { ExceptionFilterInterface } from './../core/exception-filters/exception-filter.interface';
import { getMongoURI } from './../core/helpers/db.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../core/controller/controller.interface.js';

@injectable()
export default class RestApplication {
  private expressApp: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface
  ) {
    this.expressApp = express();
  }

  private async _initDb() {
    this.logger.info('init DB');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.databaseClient.connect(mongoUri);

    this.logger.info('init DB complete');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization…');

    this.expressApp.use(express.json());

    this.logger.info('Global middleware initialization completed');
  }

  private async _initRoutes() {
    this.logger.info('Controller initialization...');

    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/users', this.userController.router);

    this.logger.info('Controller initialization complete');
  }

  private async _initServer() {
    this.logger.info('Try to init server...');

    const port = this.config.get('PORT');
    this.expressApp.listen(port);

    this.logger.info(`🚀Server started on http://localhost:${this.config.get('PORT')}`);
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filters initialization');

    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));

    this.logger.info('Exception filters completed');
  }

  public async init() {
    this.logger.info('App initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this._initDb();
    await this._initMiddleware();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
