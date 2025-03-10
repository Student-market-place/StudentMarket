import StudentService from "@/services/student.service";
import { StudentWithRelation } from "@/types/student.type";
import { useQuery } from "@tanstack/react-query";
import CardStudent from "./CardStudent";

const StudentList = () => {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      StudentService.fetchStudents({
        isAvailable: true,
      }),
  });

  const students = query.data;
  return (
    <>
      {students?.map((student: StudentWithRelation) => (
        <CardStudent key={student.id} student={student} />
      ))}
    </>
  );
};

export default StudentList;
