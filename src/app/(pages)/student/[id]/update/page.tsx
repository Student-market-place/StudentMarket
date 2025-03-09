"use client";

import StudentProfileCard from "@/components/custom-ui/StudentProfileCard";
import StudentService from "@/services/student.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import StudentUpdateForm from "@/components/custom-ui/StudentUpdateForm";
import SkillService from "@/services/skill.service";

const StudentUpdateProfile = () => {
  const { id } = useParams() as { id: string };

  const {
    data: student,
    isLoading: isLoadingStudent,
    isError: isErrorStudent,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => StudentService.fetchStudentById(id),
  });

  const {
    data: skills,
    isLoading: isLoadingSkills,
    isError: isErrorSkills,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: () => SkillService.fetchSkills(),
  });

  if (isLoadingStudent || isLoadingSkills) {
    return <div>Loading...</div>;
  }

  if (isErrorStudent || isErrorSkills) {
    return <div>Error loading data.</div>;
  }

  if (!student || !skills) {
    return <div>No data found.</div>;
  }

  return (
    <div className="py-2 gap-x-28 flex justify-center items-center ">
      <StudentProfileCard key={student.id} student={student} />
      <StudentUpdateForm student={student} allSkills={skills} />
    </div>
  );
};

export default StudentUpdateProfile;
