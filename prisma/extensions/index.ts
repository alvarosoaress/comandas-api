import { Prisma } from '@prisma/client'
import type { User } from '@prisma/client';

// Para criar outras extensões, defina dentro desse export
// Exemplo -> extensão para Shop
// debaixo de user colocar shop: e fazer a extensão

export default Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      user: {
        async $exclude (user: User, Key: string): Promise<Omit<User, typeof Key>> {
          // Object.entries cria um array a partir de um objeto
          // filter para deixar no array todos items que sua key (sua posição [0])
          // seja diferente de 'Key'
          // Object.fromEntries cria um objeto a partir do array filtrado
          return Object.fromEntries(
            Object.entries(user).filter((item) => item[0] !== Key)
          )
        }
      }
    }
  })
})
