"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Selecciona un archivo DICOM.");
      return;
    }
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/dicom/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setMessage("¡Archivo subido exitosamente!");
      setFile(null);
    } else {
      setMessage("Error al subir el archivo.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Subir imagen DICOM</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".dcm,application/dicom"
          onChange={handleFileChange}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Subiendo..." : "Subir"}
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-green-600">{message}</div>
      )}
    </div>
  );
}