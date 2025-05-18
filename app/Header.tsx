"use client";

import Link from "next/link";
import UserRoleBadge from "@/components/UserRoleBadge";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
return (
  <header className="w-full bg-white shadow-md py-4 px-8">
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        DICOM Manager
      </Link>
      <div className="flex items-center space-x-4">
        {session && session.user ? (
          <>
            <Link
              href="/dashboard/patient"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Mi Dashboard
            </Link>
            <Link
              href="/upload"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Subir DICOM
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 flex flex-col items-end">
                {session.user.name && <div>{session.user.name}</div>}
                <div>{session.user.email}</div>
                {session.user.role && (
                  <UserRoleBadge role={session.user.role} />
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  </header>
);
}