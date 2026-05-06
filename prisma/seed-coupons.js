const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding coupons...');
  
  const coupons = [
    { code: 'FEAST10', discount: 10.0, isActive: true },
    { code: 'WELCOME20', discount: 20.0, isActive: true },
    { code: 'VIP50', discount: 50.0, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  
  console.log('Coupons seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
