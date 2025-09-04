import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface User {
  name: string;
  username: string;
  image: string;
  id: string;
  _id: string;
}

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="flex justify-between">
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
        <div>
          <h3 className="text-small-semibold text-light-1">{user.name}</h3>
          <p className="text-subtle-medium text-gray-1">@{user.username}</p>
        </div>
      </div>

      {/*//! view button */}

      <Button
        asChild
        className="bg-primary-500 hover:bg-primary-500/80 !text-small-medium text-light-2"
      >
        <Link href={`/profile/${user.id}`} className="relative">
          View
        </Link>
      </Button>
    </div>
  );
}
