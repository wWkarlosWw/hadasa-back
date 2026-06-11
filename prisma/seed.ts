import { PrismaClient, UserRole, OrgType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@hadassa.com' },
    update: {},
    create: {
      ci: '0000001',
      name: 'Admin Hadassa',
      email: 'admin@hadassa.com',
      password: hashedPassword,
      phone: '70000001',
      address: 'Oficina Central',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'supervisor@hadassa.com' },
    update: {},
    create: {
      ci: '0000002',
      name: 'Supervisor Hadassa',
      email: 'supervisor@hadassa.com',
      password: hashedPassword,
      phone: '70000002',
      address: 'Oficina Central',
      role: UserRole.SUPERVISOR,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@hadassa.com' },
    update: {},
    create: {
      ci: '0000003',
      name: 'Usuario Regular',
      email: 'user@hadassa.com',
      password: hashedPassword,
      phone: '70000003',
      address: 'Zona residencial',
      role: UserRole.USER,
      isActive: true,
    },
  });

  const org1 = await prisma.organization.upsert({
    where: { email: 'info@fundacionesperanza.org' },
    update: {},
    create: {
      name: 'Fundación Esperanza',
      email: 'info@fundacionesperanza.org',
      password: hashedPassword,
      address: 'Av. Solidaridad 123',
      type: OrgType.CHARITY,
      isActive: true,
    },
  });

  await prisma.organization.upsert({
    where: { email: 'contacto@ayudaong.org' },
    update: {},
    create: {
      name: 'Ayuda ONG',
      email: 'contacto@ayudaong.org',
      password: hashedPassword,
      address: 'Calle del Voluntariado 456',
      type: OrgType.NGO,
      isActive: true,
    },
  });

  await prisma.event.create({
    data: {
      name: 'Campaña de Invierno',
      description:
        'Recolección de frazadas y abrigos para familias de escasos recursos.',
      date: new Date('2026-06-15T10:00:00.000Z'),
      organizationId: org1.id,
      isActive: true,
    },
  });

  await prisma.discounts.create({
    data: {
      code: 'ESPERANZA10',
      discount: 10.0,
      organizationId: org1.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
