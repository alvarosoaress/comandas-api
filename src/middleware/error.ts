import { type Request, type Response, type NextFunction } from 'express';
import { type ApiError } from '../helpers/api.erros';

export function errorMiddleware (
  err: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> {
  const statusCode = err.statusCode ?? 500

  return res.status(statusCode).json({
    error: true,
    message: err.message ?? 'Internal Sever Error'
  });
}
