import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SwitchChoice } from "@/components/custom-ui/SwitchChoice";

export function UpdateSchool() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Mise à jour une école</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mise à jour l&apos;école</DialogTitle>
          <DialogDescription>
            Remplissez tous les champs pour mettre à jour l&apos;école
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Domain
            </Label>

            <Input id="username" className="col-span-3" />
          </div>
          <SwitchChoice />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateSchool;
