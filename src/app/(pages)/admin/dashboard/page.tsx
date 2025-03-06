import { CompanyTable } from "@/components/custom-ui/CompanyTable";
import { SchoolTable } from "@/components/custom-ui/SchoolTable";
import { StudentTable } from "@/components/custom-ui/StudentTable";

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
