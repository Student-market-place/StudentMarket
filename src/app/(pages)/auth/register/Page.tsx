import AuthCard from "@/components/custom-ui/AuthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="student" className="w-[350px]">
        <TabsList className="w-full">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <AuthCard variant="student" />
        </TabsContent>
        <TabsContent value="company">
          <AuthCard variant="company" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterPage;
