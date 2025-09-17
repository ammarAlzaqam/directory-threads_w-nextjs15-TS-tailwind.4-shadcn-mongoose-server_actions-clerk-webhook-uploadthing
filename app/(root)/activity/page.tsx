import {
  fetchUser,
  fetchUserPosts,
  getActivities,
} from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function ActivityPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const userInfo = await fetchUser(userId);

  const activities = await getActivities(userInfo._id);
  return (
    <section>
      <h1 className="text-heading1-bold mb-14">Activity</h1>

      <div className="flex flex-col gap-5">
        {activities.map((activity) => (
          <Link
            href={`/thread/${activity.parentId}`}
            key={activity._id}
            className="px-4 xs:px-7 py-4 flex items-center gap-2 bg-dark-3"
          >
            {/*//! Author image */}
            <div className="relative h-5 w-5">
              <Image
                src={activity.author.image}
                alt="profile-img"
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/*//! Author name */}
            <p className="text-small-medium text-primary-500">
              {activity.author.name}
            </p>
            <p className="text-small-medium line-clamp-1">
              replied to your thread
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
