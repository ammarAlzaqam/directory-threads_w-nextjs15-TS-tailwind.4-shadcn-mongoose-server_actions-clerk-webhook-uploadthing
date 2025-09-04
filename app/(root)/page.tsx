import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function App() {
  const { threads, numOfPages } = await fetchPosts(3);
  if (threads.length === 0) {
    return <p className="no-result">No threads</p>;
  }
  const user = await currentUser();
  const userInfo = await fetchUser(user?.id || "");
  return (
    <main>
      <h1 className="text-heading1-bold mb-10">Home</h1>
      <section className="flex flex-col gap-10">
        {threads.map((thread) => (
          <ThreadCard user={userInfo} key={thread._id} thread={thread} />
        ))}
      </section>
    </main>
  );
}
