import { StudentProfilCard } from "@/components/custom-ui/StudentProfilCard";
import { Button } from "@/components/ui/button";

const SettingsStudentPage = () => {
  return (
    <div>
      <h1 className="text-4xl p-6 font-bold text-center text-gray-800 dark:text-white mt-6 mb-4 tracking-wide">
        👋 Hello, it's your profile!
      </h1>

      <div className="flex justify-center items-center flex-col">
        <StudentProfilCard />
      </div>
    </div>
  );
};

export default SettingsStudentPage;
