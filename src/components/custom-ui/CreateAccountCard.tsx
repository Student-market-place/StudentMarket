"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { SkillsCombobox } from "./SkillsCombobox";

interface FormValues {
  firstName: string;
  lastName: string;
  status: string;
  isAvailable: boolean;
}

const CreateAccountCard = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      status: "",
      isAvailable: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log({ ...data });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Tell us more about yourself!
        </CardTitle>
        <CardDescription>
          Complete your account setup by providing more information about
          yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === "internship"}
                          onCheckedChange={() => field.onChange("internship")}
                        />
                        <Label>Internship</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === "apprenticeship"}
                          onCheckedChange={() =>
                            field.onChange("apprenticeship")
                          }
                        />
                        <Label>Apprenticeship</Label>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="isAvailable">Available</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <SkillsCombobox />
            </FormItem>
            <Button type="submit" className="cursor-pointer">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAccountCard;
