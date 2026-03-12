import { prisma } from '../../lib/prisma';

export async function cleanupTestUsers() {
  // Delete all test users (emails containing 'test')
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test',
      },
    },
  });
}

export async function disconnectDb() {
  await prisma.$disconnect();
}
