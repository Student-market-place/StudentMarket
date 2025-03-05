import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const CardStudent = () => {
  return (
    <Card className="flex flex-col gap-2 w-[250px] p-0 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent  transition-all">
      <CardHeader className="p-0">
        <img
          src="https://images.pexels.com/photos/4298629/pexels-photo-4298629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Student"
          className="w-full h-35 object-cover"
        />
        <div className="p-3 text-center">
          <CardTitle className="text-md font-semibold">Emma Dupont</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            ESD Bordeaux
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="flex flex-wrap gap-1 mt-1">
          {["React", "Vue.js", "TypeScript", "UI/UX Design"].map(
            (skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            )
          )}
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-3 text-center text-xs text-gray-400 flex flex-col gap-2 py-3">
        Étudiant(e) en Web Development
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition">
          Voir le profil
        </button>
      </CardFooter>
    </Card>
  );
};

export default CardStudent;
