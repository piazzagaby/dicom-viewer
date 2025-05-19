"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type DicomFile = {
  id: string;
  filename: string;
  uploadedAt: string;
};

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const [dicomFiles, setDicomFiles] = useState<DicomFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDicomFiles() {
      setLoading(true);
      const res = await fetch("/api/dicom?mine=true");
      const data = await res.json();
      setDicomFiles(data);
      setLoading(false);
    }
    fetchDicomFiles();
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Mis archivos DICOM</h1>
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
        <div>No tienes archivos DICOM subidos.</div>
      ) : (
        <ul className="space-y-2">
          {dicomFiles.map((file) => (
            <li
              key={file.id}
              className="border rounded px-4 py-2 flex justify-between items-center"
            >
              <span>{file.filename}</span>
              <span className="text-xs text-gray-500">
                {new Date(file.uploadedAt).toLocaleString()}
              </span>
              <Link
                href={`/api/dicom/download/${file.id}`}
                className="text-green-600 hover:underline"
                download
              >
                Descargar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}