
import CreateAccountCard from "@/components/custom-ui/CreateAccountCard";

const CreateAccountPage = () => {
  const user = localStorage.getItem("user");  
 const role = user?.role;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <CreateAccountCard role={role} />
    </div>
  );
};

export default CreateAccountPage;
