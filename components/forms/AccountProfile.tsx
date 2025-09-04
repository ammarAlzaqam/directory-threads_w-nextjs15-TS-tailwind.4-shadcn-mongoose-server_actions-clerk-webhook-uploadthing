"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidationSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Shell } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import toast from "react-hot-toast";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export default function AccountProfile({ user, btnTitle }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const { startUpload } = useUploadThing("media");

  const form = useForm({
    defaultValues: {
      profile_photo: user.image,
      name: user.name,
      username: user.username,
      bio: user.bio,
    },
    resolver: zodResolver(UserValidationSchema),
  });

  const handleSubmit = form.handleSubmit(
    async ({ username, name, profile_photo, bio }) => {
      try {
        setLoading(true);
        const hasImgChange = isBase64Image(profile_photo);
        if (hasImgChange) {
          const imgRes = await startUpload(files);
          if (imgRes && imgRes[0]) {
            profile_photo = imgRes[0].ufsUrl;
          } else {
            profile_photo = user?.image || "";
          }
        }

        await updateUser({
          userId: user?.id,
          username,
          name,
          image: profile_photo,
          bio,
          path,
        });

        toast.success("Profile updated successfully");
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  );

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    const allFiles = e.target.files;
    if (!allFiles?.length || !allFiles[0]?.type.includes("image")) return;
    setFiles(Array.from(allFiles));

    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const imgUrl = event?.target?.result?.toString() || "";
      fieldChange(imgUrl);
    };
    fileReader.readAsDataURL(allFiles[0]);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="h-24 w-24 rounded-full bg-dark-4 flex justify-center items-center">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="Profile Photo"
                    width={96}
                    height={96}
                    className="object-contain w-full h-full rounded-full"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="Profile Photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold !text-gray-500 dark:text-gray-300">
                <Input
                  type="file"
                  accept="image/*"
                  className="border-none outline-none file:text-blue cursor-pointer !bg-transparent"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>

              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="no-focus account-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>

              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="no-focus account-form_input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={10}
                  {...field}
                  className="no-focus account-form_input min-h-48"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className={`cursor-pointer ${
            loading ? "text-gray-300" : "bg-primary-500"
          }`}
        >
          {loading ? <Shell className="animate-spin" /> : btnTitle}
        </Button>
      </form>
    </Form>
  );
}
