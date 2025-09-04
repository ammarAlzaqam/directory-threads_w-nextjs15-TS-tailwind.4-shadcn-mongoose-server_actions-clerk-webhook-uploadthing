import { z } from "zod";

export const UserValidationSchema = z.object({
  profile_photo: z.url().nonempty(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
});

export const ThreadValidationSchema = z.object({
  text: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(300, { message: "Maximum 300 characters" }),
  accountId: z.string(),
});

export const CommentValidationSchema = z.object({
  thread: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(300, { message: "Maximum 300 characters" }),
});