import { PrismaClient } from '@prisma/client'
import $extensions from '../../prisma/extensions';

const prisma = new PrismaClient().$extends($extensions);

export { prisma }
