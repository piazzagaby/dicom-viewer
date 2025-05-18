import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  // Busca el usuario y su rol
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, patients: { select: { id: true } } },
  });

  if (!user) {
    return NextResponse.json([], { status: 404 });
  }

  let whereClause = {};

  if (user.role === "PATIENT") {
    whereClause = { patientId: user.id };
  } else if (user.role === "DOCTOR") {
    // Archivos de todos sus pacientes
    const patientIds = user.patients.map((p) => p.id);
    whereClause = { patientId: { in: patientIds } };
  } else if (user.role === "HOSPITAL") {
    // Todos los archivos
    whereClause = {};
  }

  const dicomFiles = await prisma.dicomFile.findMany({
    where: whereClause,
    orderBy: { uploadedAt: "desc" },
    select: {
      id: true,
      filename: true,
      uploadedAt: true,
      patientId: true,
      patient: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(dicomFiles);
}