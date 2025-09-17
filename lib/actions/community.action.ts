"use server";

import { FilterQuery } from "mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import connectDB from "../mongoose";
import { revalidatePath } from "next/cache";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

//! Fetch community by id
export async function fetchCommunity(communityId: string) {
  try {
    await connectDB();

    const communityDetails = await Community.findOne({ id: communityId })
      .populate([
        "createdBy",
        { path: "members", model: User, select: "name username image _id id" },
      ])
      .populate({
        path: "threads",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "name image id _id",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "image name _id id",
            },
          },
          {
            path: "community",
            model: Community,
          },
        ],
      })
      .populate({
        path: "requests.user",
        model: User,
        select: "name username image id _id",
      });

    return communityDetails;
  } catch (error: any) {
    throw new Error(`Failed to fetch community: ${error.message}`);
  }
}

//! Fetch Communities
interface FetchAllParams {
  pageNumber: number;
  pageSize: number;
  searchString: string;
  sortBy?: -1 | 1;
}
export async function fetchCommunities({
  pageNumber = 1,
  pageSize = 20,
  searchString = "",
  sortBy = -1,
}: FetchAllParams) {
  try {
    await connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof Community> = searchString.trim()
      ? {
          $or: [{ name: { $regex: regex } }, { slug: { $regex: regex } }],
        }
      : {};

    const communities = await Community.find(query)
      .sort({ "members.length": sortBy })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "members", model: User, select: "_id id name image" });

    const totalCommunitiesCount = await Community.countDocuments(query);

    const nofPages = Math.ceil(totalCommunitiesCount / pageSize);

    return { communities, nofPages };
  } catch (error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }
}

//! Make Request to join to community
export async function requestToJoinCommunity(
  communityId: string,
  userId: string
) {
  try {
    await connectDB();

    const community = await Community.findById(communityId);
    if (!community) throw new Error("community not found");

    // check if already member
    if (community.members.includes(userId))
      throw new Error("user is already a member.");

    // check if request already exists
    const exists =
      community.requests?.length > 0
        ? community.requests?.find(
            (req: any) => req.user.toString() === userId.toString()
          )
        : "";
    if (exists) throw new Error("request already sent");

    community.requests.push({ user: userId });
    await community.save();
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error.message || "Failed to make join request to community"
    );
  }
}

type Action = "remove" | "approved" | "rejected";
interface Props {
  communityId: string;
  userId: string;
  action: Action;
  path: string;
}
//!handel community request
export async function handelCommunityRequest({
  communityId,
  userId,
  action,
  path,
}: Props) {
  try {
    await connectDB();
    const clerk_client = await clerkClient();

    const community = await Community.findById(communityId);
    if (!community) throw new Error(`Community not found`);

    const user = await User.findById(userId);

    const request = community.requests.find(
      (req: any) => req.user.toString() === userId.toString()
    );
    if (!request)
      throw new Error(`User has no request to ${community.name} community`);

    switch (action) {
      case "remove": {
        await Community.findByIdAndUpdate(communityId, {
          $pull: { requests: { user: userId } },
        });
        break;
      }

      case "approved": {
        await Community.findByIdAndUpdate(
          communityId,
          {
            $set: { "requests.$[elem].status": action },
            $addToSet: { members: userId },
          },
          {
            arrayFilters: [{ "elem.user": userId }],
            new: true,
          }
        );
        await clerk_client.organizations.createOrganizationMembership({
          organizationId: community.id,
          userId: user.id,
          role: "org:member",
        });
        break;
      }

      case "rejected": {
        // request.status = action;

        await Community.findByIdAndUpdate(
          communityId,
          {
            $set: { "requests.$[elem].status": action },
            $pull: { members: userId },
          },
          {
            arrayFilters: [{ "elem.user": userId }],
          }
        );

        const memberships =
          await clerk_client.organizations.getOrganizationMembershipList({
            organizationId: community.id,
          });

        const membership = memberships.data.find(
          (m: any) => m.publicUserData?.userId === user.id
        );

        if (membership)
          await clerk_client.organizations.deleteOrganizationMembership({
            organizationId: community.id,
            userId: user.id,
          });
        break;
      }

      default:
        throw new Error(`This action not valid.`);
    }

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(
      `Failed to ${action} user, ${error.message}` || `Failed to ${action} user`
    );
  }
}

//! Create Community
interface CreateParams {
  id: string;
  name: string;
  username: string;
  image: string;
  createdBy: string;
}
export async function createCommunity({
  id,
  name,
  username,
  image,
  createdBy,
}: CreateParams) {
  try {
    await connectDB();

    const owner = await User.findOne({ id: createdBy });
    if (!owner)
      throw new Error(`Failed to create community: community owner not found!`);

    const createdCommunity = await Community.create({
      id,
      name,
      username,
      image,
      createdBy: owner._id,
    });

    owner.communities.push(createdCommunity._id);
    await owner.save();

    return createdCommunity;
  } catch (error: any) {
    throw new Error(`Failed to create community: ${error.message}`);
  }
}

//! Update Community
interface UpdateParams {
  communityId: string;
  name: string;
  image: string;
  username: string;
  bio?: string;
  path?: string;
}
export async function updateCommunity({
  communityId,
  name,
  image,
  username,
  bio = "",
  path = "",
}: UpdateParams) {
  try {
    await connectDB();

    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      {
        name,
        username,
        image,
        bio,
      }
    );

    if (!updatedCommunity) {
      throw new Error("Failed to update community: community not found");
    }

    if (path.includes("/communities")) revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedCommunity));
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update community: ${error.message}`);
  }
}

//! Delete Community
export async function deleteCommunity(communityId: string) {
  try {
    await connectDB();

    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Failed to delete community: community not found");
    }

    await Thread.deleteMany({ community: deletedCommunity._id });

    await User.updateMany(
      { communities: deletedCommunity._id },
      { $pull: { communities: deletedCommunity._id } }
    );

    return deletedCommunity;
  } catch (error: any) {
    throw new Error(`Failed to delete community: ${error.message}`);
  }
}

//! Add Member To Community
export async function addMemberToCommunity(
  communityId: string,
  userId: string
) {
  try {
    await connectDB();

    const community = await Community.findOne({ id: communityId });
    if (!community)
      throw new Error("Failed to add member to community: community not found");

    const user = await User.findOne({ id: userId });
    if (!user)
      throw new Error("Failed to add member to community: user not found");

    if (community.members.includes(user._id)) {
      throw new Error(
        "Failed to add member to community: user is already a member of community"
      );
    }

    community.members.push(user._id);
    await community.save();

    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to add member to community: ${error.message}`);
  }
}

//! Delete Member From Community
export async function deleteMemberFromCommunity(
  communityId: string,
  userId: string
) {
  try {
    await connectDB();

    const community = await Community.findOne(
      { id: communityId },
      { _id: 1, members: 1 }
    );
    if (!community)
      throw new Error(
        "Failed to delete member from community: community not found"
      );

    const user = await User.findOne({ id: userId }, { _id: 1 });
    if (!user)
      throw new Error("Failed to delete member from community: user not found");

    if (!community.members.includes(user._id)) {
      throw new Error(
        "Failed to delete member from community: user is not exist in community"
      );
    }

    await Community.updateOne(
      {
        _id: community._id,
      },
      {
        $pull: { members: user._id },
      }
    );

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { communities: community._id },
      }
    );

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to delete member from community: ${error.message}`);
  }
}
