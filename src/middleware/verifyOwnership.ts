/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request } from 'express';
import { ForbiddenError } from '../helpers/api.erros';

const verifyOwnership = (
  ownership: boolean,
  req: Request<unknown, unknown, unknown>,
) => {
  const requesterId = req.user.id;

  if (!requesterId) {
    throw new ForbiddenError('Invalid token');
  }

  if (requesterId === 'admin') ownership = true;

  if (!ownership) {
    throw new ForbiddenError('Token does not have the right privileges');
  }
};

export default verifyOwnership;
