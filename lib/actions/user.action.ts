"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import connectDB from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: UpdateUserParams) {
  try {
    await connectDB();
    await User.updateOne(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
