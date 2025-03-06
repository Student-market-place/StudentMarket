import { CompanyTable } from "@/components/custom-ui/table/CompanyTable";
import { SchoolTable } from "@/components/custom-ui/table/SchoolTable";
import { StudentTable } from "@/components/custom-ui/table/StudentTable";

const DashboardAdminPage = () => {
  return (
    <div>
      <SchoolTable />
      <CompanyTable />
      <StudentTable />
    </div>
  );
};

export default DashboardAdminPage;
