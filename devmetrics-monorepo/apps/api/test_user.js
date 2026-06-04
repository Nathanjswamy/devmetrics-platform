const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst().then(u => console.log(u)).finally(() => prisma.$disconnect());
