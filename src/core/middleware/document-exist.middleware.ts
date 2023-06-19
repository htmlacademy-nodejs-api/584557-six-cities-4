import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { DocumentExistInterface } from './../../types/document-exist.interface.js';
import HttpError from '../errors/http-error.js';

export class DocumentExistMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params }: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const documentId = params[this.paramName];

    if(!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} whith ${documentId} not found.`,
        'DocumentExistMiddlewear'
      );
    }

    next();
  }
}
