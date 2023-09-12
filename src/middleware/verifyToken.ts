import { type Request, type Response, type NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../helpers/api.erros';
import jwt, { type VerifyErrors, type Secret } from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { type User } from '../../database/schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type DecodedType = {
  userInfo: User;
  iat: number;
  exp: number;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const verifyToken =
  (role?: 'client' | 'shop') =>
  (req: Request, res: Response, next: NextFunction) => {
    const headerToken =
      req.headers.authorization ?? (req.headers.Authorization as string);

    if (!headerToken)
      throw new UnauthorizedError('Authorization token was not provided');

    const authToken = headerToken.split(' ')[1];

    jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      (err: VerifyErrors | null, decoded) => {
        if (err) throw new ForbiddenError(err.message);

        const decodedInfo = decoded as DecodedType;

        if (role) {
          if (decodedInfo.userInfo.role === role) {
            next();
          } else {
            throw new ForbiddenError(
              'Token does not have the right privileges',
            );
          }
        }
      },
    );

    next();
  };

export default verifyToken;
