import { Skill } from "@prisma/client";
import axios from "axios";

const END_POINT = `${process.env.NEXT_PUBLIC_API_URL}/skill`;

async function fetchSkills(): Promise<Skill[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${baseUrl}/api/skill`;
  const response = await axios.get(url);
  return response.data;
}

async function fetchSkill(id: string): Promise<Skill> {
  const response = await axios.get(`${END_POINT}/${id}`);
  return response.data;
}

async function postSkill(skill: Skill): Promise<Skill> {
  const response = await axios.post(END_POINT, skill);
  return response.data;
}

async function putSkill(skill: Skill): Promise<Skill> {
  const response = await axios.put(`${END_POINT}/${skill.id}`, skill);
  return response.data;
}

async function deleteSkill(skill: Skill): Promise<Skill> {
  const response = await axios.delete(`${END_POINT}/${skill.id}`);
  return response.data;
}

const SkillService = {
  fetchSkills,
  fetchSkill,
  postSkill,
  putSkill,
  deleteSkill,
};

export default SkillService;
