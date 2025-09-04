import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import {
  fetchUser,
  fetchUserComments,
  fetchUserPosts,
} from "@/lib/actions/user.action";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchUser(id);
  if (!user?.onboarded) redirect("/onboarding");

  const userThreads = await fetchUserPosts(user._id);
  const userComments = await fetchUserComments(user._id);

  return (
    <section>
      <ProfileHeader user={user} />

      <Tabs className="mt-10" defaultValue="threads">
        <TabsList className="w-full tab justify-between bg-dark-3">
          {profileTabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              className="cursor-pointer tab"
              value={tab.value}
            >
              <div className="flex gap-3">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="bg-dark-4 rounded-sm px-2 py-1 text-tiny-medium text-light-2">
                    {userThreads.length}
                  </p>
                )}

                {tab.label === "Replies" && (
                  <p className="bg-dark-4 rounded-sm px-2 py-1 text-tiny-medium text-light-2">
                    {userComments.length}
                  </p>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/*//! Tabs content */}
        <section className="mt-10">
          <TabsContent value="threads">
            <ThreadsTab user={user} posts={userThreads} accountType="User" />
          </TabsContent>

          <TabsContent value="replies">
            <ThreadsTab user={user}
              posts={userComments}
              accountType="User_Replies"
            />
          </TabsContent>

          <TabsContent value="tagged">
            <p className="no-result">No tags</p>
          </TabsContent>
        </section>
      </Tabs>
    </section>
  );
}
