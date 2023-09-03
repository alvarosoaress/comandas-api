import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type Secret } from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { db } from '../../../database';
import { user } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import deleteObjKey from '../../utils/index';
import {
  type userLoginType,
  type createUserType,
  type getUserType,
} from './user.schema';
import {
  type HandleLoginRes,
  type CreateUserRes,
  type GetUsersRes,
  type LoggedUser,
} from './types.user.controller';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../helpers/api.erros';

dotenv.config({ path: path.resolve('./.env') });

export async function getUsers(
  req: Request,
  res: Response<GetUsersRes>,
): Promise<Response<GetUsersRes, Record<string, any>>> {
  const users = await db.query.user.findMany({ columns: { password: false } });

  if (!users) throw new NotFoundError('No users found');

  return res.status(200).json({
    error: false,
    data: users,
  });
}

export async function getUser(req: Request<getUserType>, res: Response) {
  const { id } = req.params;

  const userFound = await db.query.user.findFirst({
    where: eq(user.id, parseInt(id)),

    columns: { password: false },
  });

  if (!userFound) throw new NotFoundError('No user found');

  return res.status(200).json({
    error: false,
    data: userFound,
  });
}

export async function createUser(
  req: Request<unknown, unknown, createUserType>,
  res: Response<CreateUserRes>,
): Promise<Response<CreateUserRes, Record<string, any>>> {
  const { name, email, password, role, phoneNumber } = req.body;

  const userExists = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (userExists != null) throw new ConflictError('User already exists');

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashPassword,
    role,
    phoneNumber,
  };

  await db.insert(user).values(newUser);

  return res.status(200).json({
    error: false,
    message: `User ${name} created`,
    data: deleteObjKey(newUser, 'password'),
  });
}

export async function handleLogin(
  req: Request<unknown, unknown, userLoginType>,
  res: Response<HandleLoginRes>,
): Promise<Response<HandleLoginRes, Record<string, any>>> {
  const { email, password } = req.body;

  const userFound = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!userFound) throw new NotFoundError('User not found');

  const matchPassword = await bcrypt.compare(password, userFound.password);

  if (!matchPassword) throw new UnauthorizedError('Credentials do not match');

  // Tirando o hashPassword do objeto userFound para não mandar como resposta
  const userInfo = deleteObjKey(userFound, 'password') as LoggedUser;

  // Trocando o hashPassword pela senha do usuário para
  // poder salvar a senha descriptografada dentro do JWT Token
  // para futuro login persistente
  userFound.password = password;

  // TODO [É interessante ter a password dentro do JWT Token ???]
  // TODO [Por enquanto ela está dentro para que toda vez que o usuário abra app]
  // TODO [Seja rodada uma função de login baseado no token salvo no SecureStorage]
  const accessToken = jwt.sign(
    { userInfo: userFound },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: '1m' },
  );

  return res.status(200).json({
    error: false,
    message: `User ${userInfo.name} logged in`,
    data: userInfo,
    accessToken,
  });
}
