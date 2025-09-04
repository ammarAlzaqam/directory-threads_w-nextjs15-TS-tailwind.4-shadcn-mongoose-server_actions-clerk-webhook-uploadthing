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
import { CommentValidationSchema } from "@/lib/validations";
import { useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { LoaderPinwheel } from "lucide-react";
import { addCommentToThread } from "@/lib/actions/thread.action";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

export default function Comment({
  threadId,
  currentUserImage,
  currentUserId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const form = useForm({
    defaultValues: {
      thread: "",
    },
    resolver: zodResolver(CommentValidationSchema),
  });

  const onSubmit = form.handleSubmit(async ({ thread }) => {
    try {
      setLoading(true);
      await addCommentToThread({
        threadId,
        text: thread,
        userId: currentUserId,
        path,
      });
      form.reset();
    } catch {
      toast.success("An error occurred while add comment");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <div className="relative h-12 w-12">
                  <Image
                    src={currentUserImage}
                    alt="profile-image"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </FormLabel>
              <FormControl className="border-none !bg-transparent">
                <Input
                  {...field}
                  placeholder="Comment..."
                  className="no-focus outline-none text-light-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          type="submit"
          className={`comment-form_btn cursor-pointer hover:!bg-primary-500/90 ${
            loading && "!bg-gray-1"
          }`}
        >
          {loading ? <LoaderPinwheel className="animate-spin" /> : "Reply"}
        </Button>
      </form>
    </Form>
  );
}
