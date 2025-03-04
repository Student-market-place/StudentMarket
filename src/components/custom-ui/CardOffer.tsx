import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const CardJobOffer = () => {
  return (
    <Card className=" w-[250px] p-4 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-md font-semibold">
          Développeur Front-end
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Entreprise XYZ - Paris, France
        </CardDescription>
        <p className="text-xs font-medium text-blue-600 mt-1">
          Stage / Alternance
        </p>
      </CardHeader>
      <CardContent className="px-3 pb-3 ">
        <div className="flex item-center justify-center flex-wrap gap-1 mt-1 ">
          {["React", "TypeScript", "Tailwind CSS", "Git"].map(
            (skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-black px-2 py-1 text-xs rounded-md"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 px-3 pb-3 text-center text-xs text-gray-400  justify-center item-center">
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition">
          Postuler
        </button>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 transition">
          Détails
        </button>
      </CardFooter>
    </Card>
  );
};

export default CardJobOffer;
