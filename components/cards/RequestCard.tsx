import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import TipTitle from "../ui/tooltip";
import { communityReqStatus } from "@/constants";
import ControlReqBtn from "../shared/ControlReqBtn";

interface User {
  name: string;
  username: string;
  image: string;
  id: string;
  _id: string;
}

interface Props {
  communityId: string;
  user: User;
  status: "pending" | "rejected" | "approved";
}

export default function RequestCard({ user, communityId, status }: Props) {
  return (
    <div className="flex justify-between gap-4">
      {/*//! user info */}
      <div className="flex gap-3 items-center">
        {/*//* image */}
        <div className="relative h-11 w-11">
          <Image
            src={user.image}
            alt="profile_img"
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/*//* name && username */}
        <div className="max-xs:max-w-[70px]">
          <h3 className="line-clamp-1 text-small-semibold text-light-1">{user.name}</h3>
          <p className="line-clamp-1 text-subtle-medium text-gray-1">@{user.username}</p>
        </div>

        {/*//! view button */}
        <TipTitle message="View">
          <Button
            asChild
            className="size-7 bg-dark-2 hover:bg-dark-2/80 !text-small-medium text-light-2"
          >
            <Link href={`/profile/${user.id}`} className="relative">
              <Eye />
            </Link>
          </Button>
        </TipTitle>
      </div>

      {/*//! control Req buttons (accept) */}
      <div className="flex items-center gap-2 xs:gap-5">
        {communityReqStatus.map((reqState) => (
          <ControlReqBtn
            key={reqState.action}
            communityId={communityId.toString()}
            userId={user._id.toString()}
            state={JSON.parse(JSON.stringify(reqState))}
            userReqStatus={status}
          />
        ))}
      </div>
    </div>
  );
}
