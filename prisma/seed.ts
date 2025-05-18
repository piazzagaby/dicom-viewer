import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpia datos previos (solo para desarrollo)
  await prisma.dicomFile.deleteMany();
  await prisma.user.deleteMany();

  // Crea usuarios
  const passwordHash = await bcrypt.hash('password123', 10);

  const hospital = await prisma.user.create({
    data: {
      name: 'Hospital Central',
      email: 'hospital@central.com',
      password: passwordHash,
      role: 'HOSPITAL',
    },
  });

  const doctor = await prisma.user.create({
    data: {
      name: 'Dr. House',
      email: 'doctor@hospital.com',
      password: passwordHash,
      role: 'DOCTOR',
      patients: {
        connect: [],
      },
    },
  });

  const patient = await prisma.user.create({
    data: {
      name: 'Juan Paciente',
      email: 'juan@paciente.com',
      password: passwordHash,
      role: 'PATIENT',
      doctors: {
        connect: [{ id: doctor.id }],
      },
    },
  });

  // Crea archivos DICOM de ejemplo
  await prisma.dicomFile.createMany({
    data: [
      {
        filename: 'ejemplo1.dcm',
        path: '/uploads/ejemplo1.dcm',
        uploadedById: doctor.id,
        patientId: patient.id,
      },
      {
        filename: 'ejemplo2.dcm',
        path: '/uploads/ejemplo2.dcm',
        uploadedById: patient.id,
        patientId: patient.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });  