import EmployeeDetailPage from "@/component/employees/EmployeeDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeRoute({ params }: Props) {
  const { id } = await params;
  return <EmployeeDetailPage employeeId={id} />;
}