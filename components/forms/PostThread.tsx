"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidationSchema } from "@/lib/validations";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Shell } from "lucide-react";
import { createThread } from "@/lib/actions/thread.action";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PostThread({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      text: "",
      accountId: userId,
    },
    resolver: zodResolver(ThreadValidationSchema),
  });

  const onSubmit = form.handleSubmit(async ({ text, accountId }) => {
    try {
      setLoading(true);
      await createThread({
        text,
        author: accountId,
        communityId: null,
        path,
      });
      toast.success("Thread created successfully");
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create thread");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-7">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  {...field}
                  className="account-form_input no-focus !min-h-72"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loading}
          className={`cursor-pointer 
            ${loading ? "text-gray-300" : "bg-primary-500"}
            `}
        >
          {loading ? <Shell className="animate-spin" /> : "Post Thread"}
        </Button>
      </form>
    </Form>
  );
}
