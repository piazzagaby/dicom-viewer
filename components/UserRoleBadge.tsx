type UserRole = "PATIENT" | "DOCTOR" | "HOSPITAL";

export default function UserRoleBadge({ role }: { role: UserRole }) {
  let color = "bg-blue-600";
  let label = "Paciente";

  if (role === "DOCTOR") {
    color = "bg-green-600";
    label = "Doctor";
  } else if (role === "HOSPITAL") {
    color = "bg-purple-600";
    label = "Hospital";
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`}
      title={`Estás logueado como ${label}`}
    >
      {label}
    </span>
  );
}