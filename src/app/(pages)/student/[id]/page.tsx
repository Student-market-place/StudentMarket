"use client";

import ProfileCard from "@/components/custom-ui/ProfileCard";
import StudentService from "@/services/student.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const StudentUpdateProfile = () => {
  const { id } = useParams() as { id: string };

  const {
    data: student,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => StudentService.fetchStudentById(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading student data.</div>;
  }

  return (
    <div className="py-2 flex justify-center">
      {student && <ProfileCard key={student.id} student={student} />}
    </div>
  );
};

export default StudentUpdateProfile;
