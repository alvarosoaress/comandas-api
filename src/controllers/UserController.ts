import { type Request, type Response } from 'express';
import { prisma } from '../database';
import bcrypt from 'bcryptjs'
import jwt, { type Secret } from 'jsonwebtoken';
import path from 'path'
import dotenv from 'dotenv'
import type { User } from '@prisma/client';

type LoggedUser = Omit<User, 'hashPassword'>

dotenv.config({ path: path.resolve('./.env') });

export default {
  async getUsers (req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();

      return res.status(200).json({
        error: false,
        users
      });
    } catch (error: any) {
      return res.status(404).json({
        error: true,
        message: error.message
      })
    }
  },

  async createUser (req: Request, res: Response) {
    try {
      const { name, email, password, phoneNumber } = req.body;
      const userExists = await prisma.user.findUnique({ where: { email } })

      if (userExists != null) {
        return res.status(409).json({
          error: true,
          message: 'User already exists'
        })
      }

      const hashPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashPassword,
          phone_number: phoneNumber
        }
      })

      return res.status(200).json({
        error: false,
        message: `User ${name} created`,
        user
      });
    } catch (error: any) {
      return res.status(400).json({
        error: true,
        message: error.message
      })
    }
  },

  async handleLogin (req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userFound = await prisma.user.findUnique({ where: { email } })

      if (userFound == null) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        })
      }

      const matchPassword = await bcrypt.compare(password, userFound.hashPassword);

      if (!matchPassword) {
        return res.status(403).json({
          error: true,
          message: 'Credentials do not match'
        })
      }

      // Tirando o hashPassword do objeto userFound para não mandar como resposta
      const userInfo = await prisma.user.$exclude(userFound, 'hashPassword') as LoggedUser;

      //   const userInfo = Object.fromEntries(Object.entries(userFound).filter(item => item[0] !== 'hashPassword')) as LoggedUser

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
    } catch (error: any) {
      return res.status(404).json({
        error: true,
        message: error.message
      })
    }
  }
}
