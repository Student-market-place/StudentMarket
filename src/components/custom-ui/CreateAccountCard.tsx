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
import { AvatarUpload } from "./AvatarUpload";
import { Textarea } from "../ui/textarea";

interface FormValues {
  profilePicture: string;
  firstName: string;
  lastName: string;
  status: string;
  isAvailable: boolean;
  CVId: string;
  skills: string[];
  description: string;
}

// *** ATTENTION ***
// THIS COMPONENT ONLY SHOW THE FIELDS FOR A STUDENT PROFILE
// FOR THE COMPANY PROFILE, THE FIELDS ARE : profilePicture, name, description

const CreateAccountCard = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      profilePicture: "",
      firstName: "",
      lastName: "",
      status: "",
      isAvailable: false,
      CVId: "",
      skills: [],
      description: "",
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
            <div className="flex justify-end gap-7">
              {/* <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => ( */}
              <FormItem className="w-1/3 flex flex-col items-center">
                <FormLabel>Profile Picture</FormLabel>
                <AvatarUpload
                  fallback=" "
                  onUpload={async (file) => {
                    console.log("Uploading file:", file.name);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                    console.log("Upload complete!");
                  }}
                />
              </FormItem>
              {/* )}
              /> */}

              <div className="w-full max-w-[280px] flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-between gap-7">
              <div className="w-1/3 flex flex-col space-y-10">
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
                              onCheckedChange={() =>
                                field.onChange("internship")
                              }
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
              </div>
              <div className="w-2/3 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="CVId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CV</FormLabel>
                      <FormControl>
                        <Input type="file" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => ( */}
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <SkillsCombobox />
                </FormItem>
                {/* )}
                /> */}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about yourself..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
