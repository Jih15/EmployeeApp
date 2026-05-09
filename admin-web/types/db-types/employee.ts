// types/employee.ts

export type Department =
  | "Engineering"
  | "HR"
  | "Finance"
  | "Marketing"
  | "Operations";

export type Role = "SuperAdmin" | "HR" | "Employee";

export type EmployeeStatus = "active" | "inactive" | "on-leave";

export type Gender = "Laki-laki" | "Perempuan";

export type DocumentStatus = "verified" | "pending" | "expired" | "missing";

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: "KTP" | "NPWP" | "Ijazah" | "Kontrak" | "BPJS" | "Foto" | "Lainnya";
  status: DocumentStatus;
  uploadedAt: string;
  expiresAt?: string;
}

export interface AttendanceSummary {
  month: string;
  hadir: number;
  telat: number;
  izin: number;
  cuti: number;
  alpha: number;
  totalHari: number;
}

export interface CareerHistory {
  id: string;
  date: string;
  type: "promotion" | "transfer" | "salary" | "status" | "join";
  description: string;
  by: string;
}

export interface Employee {
  id: string;
  // Identitas
  name: string;
  initials: string;
  avatarBg: string;
  avatarFc: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender;
  address: string;
  // Pekerjaan
  department: Department;
  role: Role;
  position: string;
  status: EmployeeStatus;
  joinDate: string;
  salary: number;
  // Kontak
  phone: string;
  email: string;
  emergencyContact: EmergencyContact;
  // Relasi
  documents: EmployeeDocument[];
  attendanceSummary: AttendanceSummary;
  careerHistory: CareerHistory[];
}