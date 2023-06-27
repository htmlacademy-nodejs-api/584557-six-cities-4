import { StatusCodes } from 'http-status-codes';
import { RestSchema } from './../../core/config/rest.schema.js';
import { ConfigInterface } from './../../core/config/config.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UnknownRecord } from './../../types/unknown-record.type.js';
import { HttpMethod } from './../../types/http-method.enum.js';
import { AppComponent } from './../../types/app-component.enum.js';
import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { Request, Response } from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDTO, createJWT } from '../../core/helpers/common.js';
import UserRdo from './rdo/user.rdo.js';
import LoginUserDto from './dto/login-user.dto.js';
import OfferRdo from '../offer/rdo/offer.rdo.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../core/middleware/upload-file.middleware.js';
import { JWT_ALGORITHM } from './user.constant.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';

type BodyGetUser = {
  userId: string
}

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) protected readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: Request<UnknownRecord, UnknownRecord, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.mail);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.mail}» exists.`,
        'UserController | create'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserRdo, result)
    );
  }

  public async login(
    { body }: Request<UnknownRecord, UnknownRecord, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        mail: user.mail,
        id: user.id
      }
    );

    this.ok(res, fillDTO(LoggedUserRdo, {
      mail: user.mail,
      token
    }));
  }

  public async checkAuthenticate({ user: { mail } }: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(mail);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async getFavorites(
    { user }: Request<UnknownRecord, UnknownRecord, BodyGetUser>,
    res: Response
  ): Promise<void> {
    const userData = await this.userService.findById(user.id);

    if (!userData) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found.',
        'UserController | getFavorites',
      );
    }

    const { favorites } = await userData.populate('favorites');

    this.ok(res, fillDTO(OfferRdo, favorites));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filePath: req.file?.path
    });
  }
}
