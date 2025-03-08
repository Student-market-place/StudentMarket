"use client";

import CreateAccountCard from "@/components/custom-ui/CreateAccountCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateAccountPage = () => {

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Tabs defaultValue="student" className="w-[350px]">
        <TabsList className="w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <CreateAccountCard role="student" />
        </TabsContent>
        <TabsContent value="company">
          <CreateAccountCard role="company" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateAccountPage;
