"use client";

import { useParams } from "next/navigation";
import { ApplicationTable } from "@/components/custom-ui/table/ApplicationTable";

const ApplyPage = () => {
  const { id: studentId } = useParams();

  if (!studentId) {
    return <div>Loading...</div>;
  }

  return <ApplicationTable studentId={studentId as string} />;
};

export default ApplyPage;
