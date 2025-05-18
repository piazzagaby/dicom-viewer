"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type DicomFile = {
  id: string;
  filename: string;
  uploadedAt: string;
  patientId: string;
  patient?: { name?: string | null; email: string };
};

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const [dicomFiles, setDicomFiles] = useState<DicomFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDicomFiles() {
      setLoading(true);
      const res = await fetch("/api/dicom");
      const data = await res.json();
      setDicomFiles(data);
      setLoading(false);
    }
    fetchDicomFiles();
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Archivos DICOM de mis pacientes</h1>
      <div className="mb-4">
        <Link
          href="/upload"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subir nuevo archivo DICOM
        </Link>
      </div>
      {loading ? (
        <div>Cargando archivos...</div>
      ) : dicomFiles.length === 0 ? (
        <div>No hay archivos DICOM de tus pacientes.</div>
      ) : (
        <ul className="space-y-2">
          {dicomFiles.map((file) => (
            <li
              key={file.id}
              className="border rounded px-4 py-2 flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <span className="font-semibold">{file.filename}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(file.uploadedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                <span className="text-sm text-gray-700">
                  Paciente: {file.patient?.name || file.patientId}
                </span>
                <Link
                  href={`/dicom/${file.id}`}
                  className="text-blue-600 hover:underline ml-4"
                >
                  Ver
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}