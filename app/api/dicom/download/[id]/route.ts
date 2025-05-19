import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dicom = await prisma.dicomFile.findUnique({
    where: { id: params.id },
  });

  if (!dicom) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  // Lee el archivo desde el disco
  const fileBuffer = fs.readFileSync(dicom.path);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/dicom",
      "Content-Disposition": `attachment; filename="${dicom.filename}"`,
    },
  });
}