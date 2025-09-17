import { fetchAllUsers } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import UserCard from "../cards/UserCard";
import User from "@/lib/models/user.model";
import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "../cards/CommunityCard";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import Community from "@/lib/models/community.model";

export default async function RightSidebar() {
  const { userId } = await auth();
  const pageSize = 4;
  const usersCount = await User.countDocuments({ id: { $ne: userId } });
  const pageNumber = Math.floor(usersCount / pageSize) || 1;
  const { users } = await fetchAllUsers({
    userId: userId || "",
    searchString: "",
    pageNumber,
    pageSize,
  });

  const communitiesCount = await Community.countDocuments();
  const pageNumberCom = Math.floor(communitiesCount / pageSize) || 1;
  const { communities } = await fetchCommunities({
    pageNumber: pageNumberCom,
    pageSize,
    searchString: "",
    sortBy: 1,
  });
  return (
    <aside className="custom-scrollbar rightsidebar">
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-heading4-medium">Suggested Communities</h2>
        {communities.map((community) => (
          <div key={community._id} className="flex justify-between">
            {/*//! user info */}
            <div className="flex gap-3 items-center">
              {/*//* image */}
              <div className="relative h-11 w-11">
                <Image
                  src={community.image}
                  alt="profile_img"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              {/*//* name && username */}
              <div>
                <h3 className="text-small-semibold text-light-1">
                  {community.name}
                </h3>
                <p className="text-subtle-medium text-gray-1">
                  @{community.username}
                </p>
              </div>
            </div>

            {/*//! view button */}

            <Button
              asChild
              className="bg-primary-500 hover:bg-primary-500/80 !text-small-medium text-light-2"
            >
              <Link href={`/communities/${community.id}`} className="relative">
                View
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-heading4-medium">Suggested Users</h2>
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </aside>
  );
}
