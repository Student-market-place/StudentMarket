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

export function EntrerpriseCard() {
  return (
    <Card className="w-[460px]  p-0 shadow-lg rounded-2xl overflow-hidden border-2 border-transparent  transition-all  ">
      <CardHeader className="p-4 bg-gradient-to-r text-black">
        <CardTitle className="text-lg font-bold">TechNovaX</CardTitle>
        <CardDescription className="text-sm text-black opacity-90">
          TechNovaX est une entreprise innovante spécialisée dans le
          développement de solutions numériques sur mesure.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <img
          src="https://images.pexels.com/photos/4298629/pexels-photo-4298629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Company"
          className="w-full h-40 object-cover"
        />
        <p className="p-4 text-black text-sm">
          Nous offrons une gamme complète de services, allant de la conception
          de sites web et d&apos;applications mobiles à l&apos;optimisation des stratégies
          digitales et au marketing en ligne.
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center ">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
          En savoir plus
        </Button>
      </CardFooter>
    </Card>
  );
}
export default EntrerpriseCard;
