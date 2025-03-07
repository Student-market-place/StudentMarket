import { StudentProfilCard } from "@/components/custom-ui/StudentProfilCard";

const SettingsStudentPage = () => {
  return (
    <div>
      <h1>Hello it's your profil</h1>
      <div className="flex justify-center items-center">
        <StudentProfilCard />
      </div>
    </div>
  );
};

export default SettingsStudentPage;
