"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import connectDB from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery } from "mongoose";
import Community from "../models/community.model";

export async function fetchUser(userId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ id: userId })
      .populate({ path: "communities", model: Community })
      .lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
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

export async function fetchUserPosts(userId: string) {
  try {
    await connectDB();

    const threads = await Thread.find({
      author: userId,
      parentId: { $in: [null, undefined] },
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "name id _id image",
      })
      .populate({
        path: "children",
        model: Thread,
        select: "_id parentId",
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads ${error.message}`);
  }
}

export async function fetchUserComments(userId: string) {
  try {
    await connectDB();

    const threads = await Thread.find({
      author: userId,
      parentId: { $nin: [null, undefined] },
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        model: Thread,
        select: "_id",
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads ${error.message}`);
  }
}

interface fetchAllUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}

export async function fetchAllUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 8,
}: fetchAllUsersParams) {
  const skipAmount = (pageNumber - 1) * pageSize;

  const regex = new RegExp(searchString, "i");

  const query: FilterQuery<typeof User> = {
    id: { $ne: userId },
  };

  if (searchString.trim() !== "")
    query.$or = [{ name: { $regex: regex } }, { username: { $regex: regex } }];

  try {
    await connectDB();
    const users = await User.find(query).skip(skipAmount).limit(pageSize);

    const totalUserCount = await User.countDocuments(query);
    const nofPages = Math.ceil(totalUserCount / pageSize);

    return { users, nofPages };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivities(userId: string) {
  try {
    await connectDB();

    const userThreads = await Thread.find({ author: userId });

    const commentThreadsIds = userThreads.flatMap((thread) => thread.children);

    const replies = await Thread.find(
      {
        _id: { $in: commentThreadsIds },
        author: { $ne: userId },
      },
      { _id: 1, parentId: 1 }
    ).populate({
      path: "author",
      model: User,
      select: "_id id name image",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activities ${error.message}`);
  }
}
