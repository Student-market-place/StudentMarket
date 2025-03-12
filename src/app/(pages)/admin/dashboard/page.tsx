"use client";
import { AllStudentTable } from "@/components/custom-ui/table/AllStudentTable";
import { CompanyTable } from "@/components/custom-ui/table/CompanyTable";
import { SchoolTable } from "@/components/custom-ui/table/SchoolTable";
import { StudentTable } from "@/components/custom-ui/table/StudentTable";
import { StudentWithRelation } from "@/types/student.type";
import StudentService from "@/services/student.service";
import { useEffect, useState } from "react";

const DashboardAdminPage = () => {
  const [students, setStudents] = useState<StudentWithRelation[]>([]);

  useEffect(() => {
    const loadStudentsData = async () => {
      const studentsData = await StudentService.fetchStudents({});
      setStudents(studentsData);
    };
    loadStudentsData();
  }, []);
  
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mt-6 mb-4 tracking-wide">
        📊 Dashboard Admin
      </h1>

      <SchoolTable />

      <CompanyTable />

      <AllStudentTable />
    </div>
  );
};

export default DashboardAdminPage;
