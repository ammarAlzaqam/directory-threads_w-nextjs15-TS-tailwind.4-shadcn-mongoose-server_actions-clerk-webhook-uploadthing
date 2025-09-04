"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectDB from "../mongoose";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  try {
    await connectDB();

    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchPosts(
  pageNumber: number = 1,
  pageSize = 10,
  sort: -1 | 1 = -1
) {
  const skipAmount = (pageNumber - 1) * pageSize;
  try {
    await connectDB();
    const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: sort })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const numOfPages = Math.ceil(totalPostCount / pageSize);

    return { threads, numOfPages };
  } catch (error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    await connectDB();
    const thread = await Thread.findById(threadId)
      .populate({ path: "author", model: User, select: "id _id name image" })
      .populate({
        path: "children",
        model: Thread,
        populate: [
          { path: "author", model: User, select: "id _id name image" },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image",
            },
          },
        ],
      });

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

interface CreateCommentParams {
  threadId: string;
  text: string;
  userId: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  text,
  userId,
  path,
}: CreateCommentParams) {
  try {
    await connectDB();
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error(`Thread not found`);

    const comment = await Thread.create({
      text,
      parentId: threadId,
      author: userId,
    });

    thread.children.push(comment._id);

    await thread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Unable to add comment: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string) {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads: any[] = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(threadId: string, path: string) {
  try {
    await connectDB();
    const thread = await Thread.findById(threadId);
    const descendantsThread = await fetchAllChildThreads(thread._id);
    const allThreadsIds = [
      ...descendantsThread.map((descendantThread) => descendantThread._id),
      thread._id,
    ];

    const uniqueAuthorThreadsIds = [
      ...new Set([
        ...descendantsThread.map((descendantThread) => descendantThread.author),
        thread.author,
      ]),
    ];

    await Thread.deleteMany({ _id: { $in: allThreadsIds } });

    await User.updateMany(
      { _id: { $in: uniqueAuthorThreadsIds } },
      {
        $pull: { threads: { $in: allThreadsIds } },
      }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
