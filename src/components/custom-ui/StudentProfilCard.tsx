import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function StudentProfilCard() {
  return (
    <Card className="relative flex bg-clip-border  bg-white text-gray-700 shadow-md w-full max-w-[48rem] flex-row">
      <div className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white rounded-r-none bg-clip-border rounded-xl shrink-0">
        <img
          src="https://images.pexels.com/photos/4298629/pexels-photo-4298629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Company"
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="p-6 bg-gradient-to-r text-black">
        <CardTitle className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          Maria Karpova
        </CardTitle>
        <CardDescription className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Étudiante en développement à la recherche d'un stage
        </CardDescription>
        <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          Passionnée par la programmation et les nouvelles technologies, je
          recherche un stage pour acquérir de l'expérience pratique et
          approfondir mes compétences en développement logiciel.
        </p>
      </CardHeader>
    </Card>
  );
}
export default StudentProfilCard;
