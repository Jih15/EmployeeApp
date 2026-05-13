import EmployeeFormPage from "@/component/employees/EmployeeFormPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeeRoute({ params }: Props) {
  const { id } = await params;
  return <EmployeeFormPage mode="edit" employeeId={id} />;
}