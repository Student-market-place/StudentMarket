import { StudentHistoryRelation } from '@/types/studentHistory.type';
import axios from 'axios';

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/student_history`;

async function fetchStudentsHistory(
): Promise<StudentHistoryRelation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = `${baseUrl}/api/student_history`;

  const response = await axios.get(url);
  return response.data;
}

async function fetchStudentHistory(id: string): Promise<StudentHistoryRelation> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

async function postStudentHistory(studentHistory: StudentHistoryRelation): Promise<StudentHistoryRelation> {
  const response = await axios.post(END_POINT, studentHistory);
  return response.data;
}

async function putStudentHistory(studentHistory: StudentHistoryRelation): Promise<StudentHistoryRelation> {
  const response = await axios.put(`${END_POINT}/${studentHistory.id}`, studentHistory);
  return response.data;
}

async function deleteStudentHistory(studentHistory: StudentHistoryRelation): Promise<StudentHistoryRelation> {
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

