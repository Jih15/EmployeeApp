import { Employee, EmployeeAccount, EmployeeBackend } from "@/types/db-types/employee";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function mapToEmployee(e: EmployeeBackend): Employee {
  const p = e.profile;
  return {
    id: e.id,                        // UUID untuk API
    employeeNumber: p.employee_number, // untuk display
    name: p.full_name,
    initials: p.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    avatarBg: "#e0e7ff",
    avatarFc: "#3730a3",
    nik: p.tax_id ?? "-",
    birthPlace: "-",
    birthDate: p.birth_date,
    gender: p.gender as Employee["gender"],
    address: p.address,
    department: p.department as Employee["department"],
    role: e.role as Employee["role"],
    position: p.position,
    status: e.is_active ? "active" : "inactive",
    joinDate: p.join_date,
    salary: p.base_salary,
    phone: p.phone,
    email: e.email,
    emergencyContact: {
      name: p.emergency_contact_name,
      relation: p.emergency_contact_relation,
      phone: p.emergency_contact_phone,
    },
    documents: [],
    attendanceSummary: {
      month: "-",
      hadir: 0, telat: 0, izin: 0, cuti: 0, alpha: 0,
      totalHari: 0,
    },
    careerHistory: [],
  };
}

export async function createEmployee(
  token: string,
  body: {
    full_name: string;
    employee_number: string;
    phone?: string;
    address?: string;
    birth_date?: string;
    gender?: string;
    department?: string;
    position?: string;
    employment_type?: string;
    join_date?: string;
    base_salary?: number;
    tax_id?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relation?: string;
    email?: string;
    password?: string;
    role?: string;
  }
): Promise<EmployeeBackend & { generated_password?: string }> {
  return apiFetch("/employees", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateEmployeeProfile(
  id: string,
  token: string,
  body: Partial<{
    full_name: string;
    phone: string;
    address: string;
    birth_date: string;
    gender: string;
    department: string;
    position: string;
    employment_type: string;
    join_date: string;
    base_salary: number;
    tax_id: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
  }>
): Promise<EmployeeBackend> {
  return apiFetch(`/employees/${id}/profile`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}


async function apiFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    console.error("Status:", res.status, await res.text());
    throw new Error(`Request gagal. Status: ${res.status}`);
  }

  return res.json();
}

export async function getEmployees(token: string): Promise<{ employees: Employee[], total: number }> {
  const data = await apiFetch("/employees", token);
  const list: EmployeeBackend[] = data.data ?? data;
  return {
    employees: list.filter(e => e.profile !== null).map(mapToEmployee),
    total: data.total ?? list.length,
  };
}

export async function getEmployeeById(id: string, token: string): Promise<EmployeeBackend> {
  return apiFetch(`/employees/${id}`, token);
}

export async function getEmployeeAccount(id: string, token: string): Promise<EmployeeAccount> {
  return apiFetch(`/employees/${id}/account`, token); // ← hapus /api/v1
}

export async function deactivateEmployee(id: string, token: string): Promise<EmployeeBackend> {
  return apiFetch(`/employees/${id}/deactivate`, token, { method: "PATCH" });
}

export async function activateEmployee(id: string, token: string): Promise<EmployeeBackend> {
  return apiFetch(`/employees/${id}/activate`, token, { method: "PATCH" });
}