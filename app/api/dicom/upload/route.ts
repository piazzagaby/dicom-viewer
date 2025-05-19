import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import fs from "fs";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Guarda el archivo en una carpeta temporal
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(os.tmpdir(), "dicom-uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  const filename = `${Date.now()}-${file.name}`;
  const savePath = path.join(uploadsDir, filename);
  fs.writeFileSync(savePath, buffer);

  // Guarda el registro en la base de datos
  await prisma.dicomFile.create({
    data: {
      filename: file.name,
      path: savePath,
      uploadedAt: new Date(),
      uploadedById: session.user.id,
      patientId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}