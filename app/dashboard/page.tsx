"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user.role === "PATIENT") {
      router.replace("/dashboard/patient");
    } else if (session.user.role === "DOCTOR") {
      router.replace("/dashboard/doctor");
    } else if (session.user.role === "HOSPITAL") {
      router.replace("/dashboard/hospital");
    }
  }, [session, status, router]);

  return <div>Cargando dashboard...</div>;
}