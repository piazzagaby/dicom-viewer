"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type DicomFile = {
  id: string;
  filename: string;
  uploadedAt: string;
  patientId: string;
  uploadedById: string;
  patient?: { name?: string | null; email: string };
  uploadedBy?: { role: string; name?: string | null; email: string };
};

export default function HospitalDashboard() {
  const { data: session, status } = useSession();
  const [dicomFiles, setDicomFiles] = useState<DicomFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDicomFiles() {
      setLoading(true);
      const res = await fetch("/api/dicom");
      const data: DicomFile[] = await res.json();
      setDicomFiles(data);
      setLoading(false);
    }
    fetchDicomFiles();
  }, []);

  // Filtra imágenes por rol de quien las subió
  const doctorFiles = dicomFiles.filter(f => f.uploadedBy?.role === "DOCTOR");
  const patientFiles = dicomFiles.filter(f => f.uploadedBy?.role === "PATIENT");

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Hospital</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabla izquierda: Imágenes subidas por doctores */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Imágenes subidas por doctores</h2>
          {loading ? (
            <div>Cargando...</div>
          ) : doctorFiles.length === 0 ? (
            <div>No hay imágenes subidas por doctores.</div>
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
                {doctorFiles.map(file => (
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
        {/* Tabla derecha: Imágenes subidas por pacientes */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Imágenes subidas por pacientes</h2>
          {loading ? (
            <div>Cargando...</div>
          ) : patientFiles.length === 0 ? (
            <div>No hay imágenes subidas por pacientes.</div>
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
                {patientFiles.map(file => (
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