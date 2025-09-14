import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateThreadPage() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <h1 className="text-heading1-bold">Create Thread</h1>
      <section className="mt-10">
        <PostThread userId={userInfo._id.toString()} />
      </section>
    </section>
  );
}
