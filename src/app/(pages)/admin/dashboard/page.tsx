import { CompanyTable } from "@/components/custom-ui/table/CompanyTable";
import { SchoolTable } from "@/components/custom-ui/table/SchoolTable";
import { StudentTable } from "@/components/custom-ui/table/StudentTable";
import { Button } from "@/components/ui/button";

const DashboardAdminPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mt-6 mb-4 tracking-wide">
        📊 Dashboard Admin
      </h1>

      <SchoolTable />

      <CompanyTable />

      <StudentTable />
    </div>
  );
};

export default DashboardAdminPage;
