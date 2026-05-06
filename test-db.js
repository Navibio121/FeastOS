const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const locations = await prisma.location.findMany();
    console.log('LOCATIONS_COUNT:', locations.length);
    console.log('LOCATIONS_DATA:', JSON.stringify(locations));
  } catch (err) {
    console.error('DB_ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
