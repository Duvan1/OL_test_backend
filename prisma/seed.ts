import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear municipios
  const municipalities = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Santa Marta',
    'Manizales',
    'Cúcuta'
  ];

  const municipalitiesData = municipalities.map(name => ({
    name,
    updated_at: new Date()
  }));

  await prisma.municipality.createMany({
    data: municipalitiesData,
    skipDuplicates: true
  });

  const createdMunicipalities = await prisma.municipality.findMany();
  console.log('Municipios creados exitosamente');

  // Crear usuarios
  const users = [
    {
      name: 'Administrador',
      email: 'admin@comercio.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      updated_at: new Date()
    },
    {
      name: 'Auxiliar de Registro',
      email: 'auxiliar@comercio.com',
      password: await bcrypt.hash('password456', 10),
      role: 'AUXILIAR',
      updated_at: new Date()
    }
  ];

  await prisma.user.createMany({
    data: users
  });

  const createdUsers = await prisma.user.findMany();
  console.log('Usuarios creados exitosamente');

  // Crear comerciantes
  const merchants = [
    {
      name: 'Juan Pérez',
      document_type: 'CC',
      document_number: '1234567890',
      phone: '3001234567',
      email: 'juan.perez@email.com',
      status: 'ACTIVE',
      updated_at: new Date()
    },
    {
      name: 'María López',
      document_type: 'CC',
      document_number: '0987654321',
      phone: '3007654321',
      email: 'maria.lopez@email.com',
      status: 'ACTIVE',
      updated_at: new Date()
    },
    {
      name: 'Carlos Rodríguez',
      document_type: 'CC',
      document_number: '5678901234',
      phone: '3009876543',
      email: 'carlos.rodriguez@email.com',
      status: 'ACTIVE',
      updated_at: new Date()
    }
  ];

  const createdMerchants = [];
  for (const merchant of merchants) {
    const createdMerchant = await prisma.merchant.create({
      data: merchant
    });
    createdMerchants.push(createdMerchant);
  }

  console.log('Comerciantes creados exitosamente');

  // Crear establecimientos
  const establishments = [
    {
      name: 'Tienda de Ropa',
      revenue: 15000.75,
      employee_count: 5,
      municipality_id: createdMunicipalities[0].id,
      merchant_id: createdMerchants[0].id,
      updated_at: new Date()
    },
    {
      name: 'Supermercado Norte',
      revenue: 25000.50,
      employee_count: 10,
      municipality_id: createdMunicipalities[1].id,
      merchant_id: createdMerchants[1].id,
      updated_at: new Date()
    },
    {
      name: 'Distribución de Tecnología',
      revenue: 35000.00,
      employee_count: 15,
      municipality_id: createdMunicipalities[2].id,
      merchant_id: createdMerchants[2].id,
      updated_at: new Date()
    },
    {
      name: 'Restaurante del Valle',
      revenue: 12000.25,
      employee_count: 7,
      municipality_id: createdMunicipalities[3].id,
      merchant_id: createdMerchants[0].id,
      updated_at: new Date()
    },
    {
      name: 'Bazar La Palma',
      revenue: 8000.00,
      employee_count: 3,
      municipality_id: createdMunicipalities[4].id,
      merchant_id: createdMerchants[1].id,
      updated_at: new Date()
    }
  ];

  for (const establishment of establishments) {
    await prisma.establishment.create({
      data: establishment
    });
  }

  console.log('Establecimientos creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 