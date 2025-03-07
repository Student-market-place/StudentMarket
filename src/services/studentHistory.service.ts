import { GetAllParams, HistoryWithRelation } from "@/types/studentHistory.type";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/student_history`;

async function fetchStudentsHistory(
  params: GetAllParams
): Promise<HistoryWithRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/student_history`;

  console.log("fetchStudentsHistory params", params);

  const queryObject: Record<string, string> = {};
  if (params.studentId !== undefined) {
    queryObject.studentId = params.studentId;
  }
  if (params.companyId !== undefined) {
    queryObject.companyId = params.companyId;
  }

  console.log("fetchStudentsHistory queryObject", queryObject);
  console.log("fetchStudentsHistory url", url);

  const response = await axios.get(url, { params: queryObject });
  return response.data;
}

async function fetchStudentHistory(id: string): Promise<HistoryWithRelation> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

async function postStudentHistory(
  studentHistory: HistoryWithRelation
): Promise<HistoryWithRelation> {
  const response = await axios.post(END_POINT, studentHistory);
  return response.data;
}

async function putStudentHistory(
  studentHistory: HistoryWithRelation
): Promise<HistoryWithRelation> {
  const response = await axios.put(
    `${END_POINT}/${studentHistory.id}`,
    studentHistory
  );
  return response.data;
}

async function deleteStudentHistory(
  studentHistory: HistoryWithRelation
): Promise<HistoryWithRelation> {
  const response = await axios.delete(`${END_POINT}/${studentHistory.id}`);
  return response.data;
}

const StudentHistoryService = {
  fetchStudentsHistory,
  fetchStudentHistory,
  postStudentHistory,
  putStudentHistory,
  deleteStudentHistory,
};

export default StudentHistoryService;
