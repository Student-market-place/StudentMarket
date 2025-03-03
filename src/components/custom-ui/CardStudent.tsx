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
    <Card>
      <CardHeader>
        <img src="" alt="" />
        <CardTitle>Student Name</CardTitle>
        <CardDescription>Student post</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default CardStudent;
