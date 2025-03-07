"use client";

import { useState, useEffect } from "react";
import CreateAccountCard from "@/components/custom-ui/CreateAccountCard";

const CreateAccountPage = () => {
  const [role, setRole] = useState<"student" | "company">("student");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setRole(user?.role || "student");
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <CreateAccountCard role={role} />
    </div>
  );
};

export default CreateAccountPage;
