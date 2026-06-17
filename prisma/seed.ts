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

  const supervisor = await prisma.user.upsert({
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

  const regularUser = await prisma.user.upsert({
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

  const orgs = await Promise.all([
    (async () => {
      const data = {
        name: 'Fundación Esperanza',
        email: 'info@fundacionesperanza.org',
        password: hashedPassword,
        address: 'Av. Solidaridad 123, La Paz',
        type: OrgType.CHARITY,
        isActive: true,
        goal: 35000,
        image:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80',
        tagline:
          'Brindando esperanza y apoyo a familias en situación de vulnerabilidad desde 2010.',
        category: 'Infancia y Familia',
        location: 'La Paz, Bolivia',
        featured: true,
        beneficiaries: 1250,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
    (async () => {
      const data = {
        name: 'Ayuda ONG',
        email: 'contacto@ayudaong.org',
        password: hashedPassword,
        address: 'Calle del Voluntariado 456, Cochabamba',
        type: OrgType.NGO,
        isActive: true,
        goal: 25000,
        image:
          'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80',
        tagline:
          'Empoderando comunidades a través de educación y desarrollo sostenible.',
        category: 'Educación',
        location: 'Cochabamba, Bolivia',
        featured: true,
        beneficiaries: 890,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
    (async () => {
      const data = {
        name: 'Luz de Esperanza',
        email: 'info@luzesperanza.org',
        password: hashedPassword,
        address: 'Av. del Maestro 789, Santa Cruz',
        type: OrgType.CHARITY,
        isActive: true,
        goal: 42000,
        image:
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80',
        tagline:
          'Iluminando el camino de niños y jóvenes hacia un futuro mejor.',
        category: 'Salud y Nutrición',
        location: 'Santa Cruz, Bolivia',
        featured: true,
        beneficiaries: 2100,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
    (async () => {
      const data = {
        name: 'Mano Solidaria',
        email: 'info@manosolidaria.org',
        password: hashedPassword,
        address: 'Calle la Amistad 321, El Alto',
        type: OrgType.COLLABORATOR,
        isActive: true,
        goal: 15000,
        image:
          'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1200&q=80',
        tagline:
          'Construyendo viviendas dignas para familias de escasos recursos.',
        category: 'Vivienda',
        location: 'El Alto, Bolivia',
        featured: false,
        beneficiaries: 560,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
    (async () => {
      const data = {
        name: 'Vida y Nutrición',
        email: 'info@vidaynutricion.org',
        password: hashedPassword,
        address: 'Av. Salud 555, La Paz',
        type: OrgType.NGO,
        isActive: true,
        goal: 28000,
        image:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
        tagline:
          'Promoviendo la salud integral y la nutrición infantil en comunidades rurales.',
        category: 'Salud',
        location: 'La Paz, Bolivia',
        featured: false,
        beneficiaries: 1800,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
    (async () => {
      const data = {
        name: 'Ecoavida Bolivia',
        email: 'info@ecoavida.org',
        password: hashedPassword,
        address: 'Km 7 Carretera a los Yungas',
        type: OrgType.NGO,
        isActive: true,
        goal: 20000,
        image:
          'https://images.unsplash.com/photo-1560419015-7c427e801ae1?w=600&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1560419015-7c427e801ae1?w=1200&q=80',
        tagline:
          'Protegiendo el medio ambiente y promoviendo la agroecología en Bolivia.',
        category: 'Medio Ambiente',
        location: 'Yungas, Bolivia',
        featured: false,
        beneficiaries: 720,
      };
      return prisma.organization.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });
    })(),
  ]);

  const event = await prisma.event.create({
    data: {
      name: 'Campaña de Invierno',
      description:
        'Recolección de frazadas y abrigos para familias de escasos recursos.',
      date: new Date('2026-06-15T10:00:00.000Z'),
      organizationId: orgs[0].id,
      isActive: true,
    },
  });

  const discount1 = await prisma.discounts.create({
    data: {
      code: 'ESPERANZA10',
      description: '10% de descuento en productos solidarios',
      discount: 10.0,
      pointsRequired: 100,
      organizationId: orgs[0].id,
    },
  });

  await prisma.discounts.create({
    data: {
      code: 'AYUDA20',
      description: '20% de descuento en talleres y cursos',
      discount: 20.0,
      pointsRequired: 200,
      organizationId: orgs[1].id,
    },
  });

  await prisma.eventSupervisor.create({
    data: {
      userId: supervisor.id,
      eventId: event.id,
    },
  });

  await prisma.eventParticipation.create({
    data: {
      userId: regularUser.id,
      eventId: event.id,
      status: 'REGISTERED',
    },
  });

  await prisma.donation.create({
    data: {
      amount: 150.0,
      status: 'PENDING',
      userId: regularUser.id,
      organizationId: orgs[0].id,
      eventId: event.id,
    },
  });

  await prisma.claimedDiscount.create({
    data: {
      pointsSpent: discount1.pointsRequired,
      status: 'PENDING',
      userId: regularUser.id,
      discountId: discount1.id,
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
