"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type DicomFile = {
  id: string;
  filename: string;
  uploadedAt: string;
  patientId: string;
  uploadedById: string;
  patient?: { name?: string | null; email: string };
};

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const [myDicomFiles, setMyDicomFiles] = useState<DicomFile[]>([]);
  const [patientDicomFiles, setPatientDicomFiles] = useState<DicomFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDicomFiles() {
      setLoading(true);
      const res = await fetch("/api/dicom");
      const data: DicomFile[] = await res.json();
      if (session?.user?.id) {
        setMyDicomFiles(data.filter(f => f.uploadedById === session.user.id));
        setPatientDicomFiles(data.filter(f => f.uploadedById !== session.user.id));
      }
      setLoading(false);
    }
    if (session?.user?.id) fetchDicomFiles();
  }, [session?.user?.id]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Doctor</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Izquierda: Imágenes del doctor */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Mis imágenes DICOM</h2>
          <Link
            href="/doctor/upload"
            className="inline-block mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Subir nuevo archivo DICOM
          </Link>
          {loading ? (
            <div>Cargando...</div>
          ) : myDicomFiles.length === 0 ? (
            <div>No has subido imágenes.</div>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Archivo</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {myDicomFiles.map(file => (
                  <tr key={file.id} className="border-t">
                    <td className="p-2">{file.filename}</td>
                    <td className="p-2">{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td className="p-2">
                      <a
                        href={`/api/dicom/download/${file.id}`}
                        className="text-green-600 hover:underline"
                        download
                      >
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Derecha: Imágenes de pacientes */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Imágenes de pacientes</h2>
          {loading ? (
            <div>Cargando...</div>
          ) : patientDicomFiles.length === 0 ? (
            <div>No hay imágenes de pacientes.</div>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Archivo</th>
                  <th className="p-2">Paciente</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patientDicomFiles.map(file => (
                  <tr key={file.id} className="border-t">
                    <td className="p-2">{file.filename}</td>
                    <td className="p-2">{file.patient?.name || file.patientId}</td>
                    <td className="p-2">{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td className="p-2">
                      <a
                        href={`/api/dicom/download/${file.id}`}
                        className="text-green-600 hover:underline"
                        download
                      >
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}