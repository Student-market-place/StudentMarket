import axios, { AxiosError } from "axios";
import { UserWithRelations } from "@/types/user.type";

interface CreateUserParams {
  email: string;
  name?: string;
}

interface UpdateUserRoleParams {
  userId: string;
  role: "student" | "company";
}

async function fetchUsers(): Promise<UserWithRelations[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/user`;

  const response = await axios.get(url, {
    params: {
      include: "student,company,school"
    }
  });
  return response.data;
}

async function fetchLatestUser(): Promise<UserWithRelations> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/user`;

  const response = await axios.get(url, {
    params: {
      latest: true,
      include: "student,company,school"
    }
  });
  return response.data;
}

async function fetchUserByEmail(email: string): Promise<UserWithRelations | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${baseUrl}/api/user`;
    
    const response = await axios.get(url, {
      params: {
        email,
        include: "student,company,school"
      }
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

async function fetchUserById(id: string): Promise<UserWithRelations | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const url = `${baseUrl}/api/user/${id}`;
    
    const response = await axios.get(url, {
      params: {
        include: "student,company,school"
      }
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

async function createUser(params: CreateUserParams): Promise<UserWithRelations> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/user`;

  const response = await axios.post(url, params);
  return response.data;
}

async function updateUserRole({ userId, role }: UpdateUserRoleParams): Promise<UserWithRelations> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/user/${userId}`;

  const response = await axios.patch(url, { role });
  return response.data;
}

const UserService = {
  fetchUsers,
  fetchLatestUser,
  fetchUserByEmail,
  fetchUserById,
  createUser,
  updateUserRole,
};

export default UserService;
