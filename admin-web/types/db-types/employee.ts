// types/employee.ts

export type Department =
  | "Engineering"
  | "HR"
  | "Finance"
  | "Marketing"
  | "Operations";

export type Role = "super_admin" | "hr" | "employee";

export type EmployeeStatus = "active" | "inactive" | "on-leave";

export type Gender = "Laki-laki" | "Perempuan";

export type DocumentStatus = "verified" | "pending" | "expired" | "missing";

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface EmployeeAccount {
  id: string;
  email: string;
  hashed_password: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
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
  employeeNumber: string; 
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

// Shape asli dari backend
export interface EmployeeProfileBackend {
  employee_id: string;
  employee_number: string;
  full_name: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
  department: string;
  position: string;
  employment_type: string;
  join_date: string;
  end_date: string | null;
  office_location_id: string;
  base_salary: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  tax_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  updated_at: string;
}

export interface EmployeeBackend {
  id: string;
  email: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  profile: EmployeeProfileBackend;
}