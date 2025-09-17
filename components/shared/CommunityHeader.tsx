"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { Confirm } from "../ui/alert-dialog";
import toast from "react-hot-toast";
import { useState } from "react";
import { requestToJoinCommunity } from "@/lib/actions/community.action";

type User = {
  _id: string;
  name: string;
  image: string;
};

interface Props {
  community: {
    _id: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    members: User[];
  };
  userObjectId: string;
}

export default function CommunityHeader({ community, userObjectId }: Props) {
  const [loading, setLoading] = useState(false);
  const handelReq = async () => {
    try {
      setLoading(true);

      await requestToJoinCommunity(community._id, userObjectId);

      toast.success(
        `You membership request has been successfully sent to ${community.name} community`
      );
    } catch (error: any) {
      console.log(error);
      toast.error(
        <p>
          Failed to make join request to {community.name} community:{" "}
          <span className="text-red-500 dark:text-red-300">{error.message}</span>
        </p>
      );
    } finally {
      setLoading(false);
    }
  };

  const exist = community.members.find(
    (member) => member._id.toString() === userObjectId.toString()
  );
  return (
    <div className="space-y-7">
      {/* img, name, community name */}
      <div className="flex gap-2 items-center">
        {/* Img */}
        <div className="relative h-20 w-20">
          <Image
            src={community.image}
            alt="Profile-Img"
            fill
            className="rounded-full object-cover"
          />
        </div>
        {/* name, username((slug)) */}
        <div className="space-y-1 flex-1">
          <h3 className="text-heading3-bold text-light-1">{community.name}</h3>
          <p className="text-base-medium text-gray-1">@{community.username}</p>
        </div>
        {/* Request to Join button */}
        {!exist && (
          <Confirm
            onConfirm={handelReq}
            confirmMsg="Make request"
            message={`It will be asked to join ${community.name} community.`}
          >
            <Button
              className={`bg-dark-2 text-light-1 hover:bg-dark-4/80 cursor-pointer max-sm:size-10`}
            >
              <CirclePlus className="size-6" />{" "}
              <p className="max-sm:hidden">Request to Join</p>
            </Button>
          </Confirm>
        )}
      </div>
      {/* bio */}
      <p className="max-w-lg text-base-regular text-light-2">{community.bio}</p>

      <div className="h-1 bg-dark-3 mt-14" />
    </div>
  );
}
