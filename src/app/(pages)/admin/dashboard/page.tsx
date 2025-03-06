import { CompanyTable } from "@/components/custom-ui/CompanyTable";
import { SchoolTable } from "@/components/custom-ui/SchoolTable";

const DashboardAdminPage = () => {
  return (
    <div>
      <SchoolTable />
      <CompanyTable />
    </div>
  );
};

export default DashboardAdminPage;
