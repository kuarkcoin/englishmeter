// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Bu, projenizin her yerinde aynı Prisma istemcisini kullanmasını sağlar
// ve "Can't reach database" hatasını önler.

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // (İsteğe bağlı) Terminalde veritabanı sorgularını görmek için:
    // log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma