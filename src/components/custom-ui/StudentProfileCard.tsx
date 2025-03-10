import { StudentWithRelation } from "@/types/student.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

interface StudentProfileCardProps {
  student: StudentWithRelation;
}

const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
  return (
    <Card className="flex flex-col h-fit gap-2 w-[300px] pt-0 shadow-lg rounded-2xl overflow-hidden border-2  transition-all">
      <CardHeader className="p-4 items-center">
        <Avatar className="w-35 h-35 relative">
          <AvatarImage
            src={student.profilePicture?.url || "/default-avatar.png"}
            className="object-cover"
            alt="Student"
          />
          <AvatarFallback>
            {student.firstName?.[0]}
            {student.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="p-3 text-center">
          <CardTitle className="text-xl font-bold">
            {student?.firstName} {student?.lastName}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {student?.user.email}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex flex-col gap-4">
        <div className="flex  gap-2">
          <Badge variant={student?.isAvailable ? "success" : "destructive"}>
            {student?.isAvailable ? "Disponible" : "Indisponible"}
          </Badge>
          <Badge variant="outline">
            {student?.status === "stage"
              ? "Stage"
              : student?.status === "alternance"
                ? "Alternance"
                : student?.status}
          </Badge>
        </div>
        <div>
          <Label>Ecole :</Label>
          <div className="text-gray-700">{student?.school.name}</div>
        </div>
        <div>
          <Label>Skills :</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {student?.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-gray-700">
                {skill?.name}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <Label>Decription : </Label>
          <Card className="mt-2 p-1 bg-gray-100 rounded-sm ">
            <CardContent className="text-sm text-gray-700 p-1">
              {student?.description.length > 100
                ? student?.description.slice(0, 100) + "..."
                : student?.description}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
