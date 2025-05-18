export const dynamic = "force-dynamic";

import Link from "next/link";

export default async function Home() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-8"
      style={{
        backgroundImage: "url('/radios.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-8 text-white text-center drop-shadow-lg">
          DICOM Manager
        </h1>
        <p className="text-lg text-white mb-8 text-center max-w-xl drop-shadow">
          Bienvenido a la plataforma para gestionar, subir y visualizar archivos DICOM.<br />
          Pacientes, doctores y hospitales pueden acceder a sus archivos médicos de forma segura.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded font-semibold hover:bg-gray-300 transition"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
