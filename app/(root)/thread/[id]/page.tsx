import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchThreadById(id);
  if (!post) notFound();

  const { userId } = await auth();
  if (!userId) return null;

  const userInfo = await fetchUser(userId);

  return (
    <section className="relative flex flex-col">
      {/*//! Thread card */}
      <ThreadCard user={userInfo} thread={post} />

      {/*//! Comment form */}
      <Comment
        threadId={id}
        currentUserImage={userInfo.image}
        currentUserId={userInfo._id.toString()}
      />

      {/*//! Thread comments */}
      <div className="max-w-3xl w-full mx-auto mt-10">
        {post.children.map((comment: any) => (
          <ThreadCard user={userInfo} key={comment._id} thread={comment} isComment={true} />
        ))}
      </div>
    </section>
  );
}
