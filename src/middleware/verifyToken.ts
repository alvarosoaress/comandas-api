import { type Request, type Response, type NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../helpers/api.erros';
import jwt, { type VerifyErrors, type Secret } from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type DecodedType = {
  role: 'customer' | 'shop' | 'apiKey' | 'admin';
  iat: number;
  exp: number;
  sub: number | string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const verifyToken =
  (role?: 'customer' | 'shop' | 'admin') =>
  (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedError('Api key was not provided');
    }

    jwt.verify(
      apiKey as string,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      (err: VerifyErrors | null, decoded) => {
        if (err) {
          throw new ForbiddenError('Invalid api key');
        }

        const decodedInfo = decoded as unknown as DecodedType;

        if (decodedInfo.role !== 'apiKey') {
          throw new ForbiddenError('Invalid api key');
        }

        // Um verify dentro de outro foi a melhor forma que encontrei
        // se estiver um fora do outro com throw nos dois dá o erro de
        // Cannot set headers after they are sent to the client
        // eu sei que está feio, desculpa...
        if (role) {
          const headerToken =
            req.headers.authorization ?? (req.headers.Authorization as string);

          if (!headerToken) {
            throw new UnauthorizedError('Authorization token was not provided');
          }

          const authToken = headerToken.split(' ')[1];

          jwt.verify(
            authToken,
            process.env.ACCESS_TOKEN_SECRET as Secret,
            (err: VerifyErrors | null, decoded) => {
              if (err) {
                throw new ForbiddenError('Invalid token');
              }

              const decodedInfo = decoded as unknown as DecodedType;

              const reqUser = {
                id: decodedInfo.sub,
                role: decodedInfo.role,
              };

              req.user = reqUser;

              if (role) {
                if (decodedInfo.role === role || decodedInfo.role === 'admin') {
                  next();
                } else {
                  throw new ForbiddenError(
                    'Token does not have the right privileges',
                  );
                }
              } else {
                next();
              }
            },
          );
        }
        // Caso a rota seja livre para todos
        else {
          next();
        }
      },
    );
  };

export default verifyToken;
