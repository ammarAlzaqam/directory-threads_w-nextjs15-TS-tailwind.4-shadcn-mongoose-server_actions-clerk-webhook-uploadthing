import {
  fetchUser,
  fetchUserComments,
  fetchUserPosts,
} from "@/lib/actions/user.action";
import ThreadCard from "../cards/ThreadCard";
import { Button } from "../ui/button";
import Link from "next/link";

interface Props {
  posts: any;
  accountType: string;
  user: any;
}

export default async function ThreadsTab({ posts, user, accountType }: Props) {
  return (
    <section
      className={`flex flex-col ${accountType !== "User_Replies" && "gap-10"}`}
    >
      {posts.map((thread: any) => (
        <section className="flex gap-2" key={thread._id}>
          <ThreadCard
            user={user}
            thread={thread}
            isComment={accountType === "User_Replies"}
          />
          {accountType === "User_Replies" && (
            <Button className="!text-tiny-medium xs:!text-subtle-semibold text-light-2 bg-primary-500 shadow-accent-foreground animate-zoom-in">
              <Link href={`/thread/${thread.parentId}`}>View Post</Link>
            </Button>
          )}
        </section>
      ))}
    </section>
  );
}
