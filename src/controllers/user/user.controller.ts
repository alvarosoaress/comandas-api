import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs'
import jwt, { type Secret } from 'jsonwebtoken';
import path from 'path'
import dotenv from 'dotenv'
import { db } from '../../../database';
import { user } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import deleteObjKey from '../../utils/index';
import { type userLoginType, type createUserType } from '../../schema/user.schema';
import { type HandleLoginRes, type CreateUserRes, type GetUsersRes, type LoggedUser } from './types.user.controller';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../helpers/api.erros';

dotenv.config({ path: path.resolve('./.env') });

export async function getUsers (req: Request, res: Response<GetUsersRes>): Promise<Response<GetUsersRes, Record<string, any>>> {
  const users = await db.query.user.findMany({ columns: { password: false } });

  if (users === null) throw new NotFoundError('No users found')

  return res.status(200).json({
    error: false,
    users
  });
};

export async function createUser (req: Request<unknown, unknown, createUserType>, res: Response<CreateUserRes>): Promise<Response<CreateUserRes, Record<string, any>>> {
  const { name, email, password, role, phoneNumber } = req.body;

  const userExists = await db.query.user.findFirst({ where: eq(user.email, email) })

  if (userExists != null) throw new ConflictError('User already exists');

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = {
    name,
    email,
    password: hashPassword,
    role,
    phoneNumber
  };

  await db.insert(user).values(newUser);

  return res.status(200).json({
    error: false,
    message: `User ${name} created`,
    newUser: deleteObjKey(newUser, 'password')
  });
};

export async function handleLogin (req: Request<unknown, unknown, userLoginType>, res: Response<HandleLoginRes>): Promise<Response<HandleLoginRes, Record<string, any>>> {
  const { email, password } = req.body;

  const userFound = await db.query.user.findFirst({ where: eq(user.email, email) });

  if (userFound == null) throw new NotFoundError('User not found');

  const matchPassword = await bcrypt.compare(password, userFound.password);

  if (!matchPassword) throw new UnauthorizedError('Credentials do not match');

  // Tirando o hashPassword do objeto userFound para não mandar como resposta
  const userInfo = deleteObjKey(userFound, 'password') as LoggedUser;

  // TODO [É interessante ter a hashPassword dentro do JWT Token ???]
  // TODO [Por enquanto ela está dentro para que toda vez que o usuário abra app]
  // TODO [Seja rodada uma função de login baseado no token salvo no SecureStorage]
  const accessToken = jwt.sign({ userInfo: userFound }, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '30s' })

  return res.status(200).json({
    error: false,
    message: `User ${userInfo.name} logged in`,
    accessToken,
    userInfo
  });
}
