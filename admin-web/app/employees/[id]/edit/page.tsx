import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/mock/employee";
import EmployeeFormPage from "@/component/employees/EmployeeFormPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeeRoute({ params }: Props) {
  const { id } = await params;
  const employee = getEmployeeById(id);
  if (!employee) notFound();
  return <EmployeeFormPage mode="edit" employee={employee!} />;
}