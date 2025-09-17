import RequestCard from "@/components/cards/RequestCard";
import UserCard from "@/components/cards/UserCard";
import CommunityHeader from "@/components/shared/CommunityHeader";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs, profileTabs } from "@/constants";
import { fetchCommunity } from "@/lib/actions/community.action";
import {
  fetchUser,
  fetchUserComments,
  fetchUserPosts,
} from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: communityId } = await params;

  const { userId } = await auth();

  if (!userId) return null;

  const userInfo = await fetchUser(userId);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const communityDetails = await fetchCommunity(communityId);

  // const communityThreads

  return (
    <section>
      <CommunityHeader
        community={JSON.parse(JSON.stringify(communityDetails))}
        userObjectId={userInfo._id.toString()}
      />

      <Tabs className="mt-10" defaultValue="threads">
        <TabsList className="w-full tab justify-between bg-dark-3">
          {communityTabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              className="cursor-pointer tab"
              value={tab.value}
            >
              <div className="flex gap-3">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} />

                <p className="max-sm:hidden">{tab.label}</p>

                {/* {tab.label === "Threads" && (
                  <p className="bg-dark-4 rounded-sm px-2 py-1 text-tiny-medium text-light-2">
                    {communityDetails.threads.length}
                  </p>
                )} */}

                {communityDetails[tab.value].length > 0 && (
                  <p className="bg-dark-4 rounded-sm px-2 py-1 text-tiny-medium text-light-2">
                    {communityDetails[tab.value].length}
                  </p>
                )}

                {/* {tab.label === "Members" && (
                  <p className="bg-dark-4 rounded-sm px-2 py-1 text-tiny-medium text-light-2">
                    {communityDetails.members.length}
                  </p>
                )} */}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/*//! Tabs content */}
        <section className="mt-10">
          {/*//* Threads */}
          <TabsContent value="threads">
            <ThreadsTab
              user={userInfo}
              posts={communityDetails.threads}
              accountType="Community"
            />
          </TabsContent>

          {/*//* Members */}
          <TabsContent value="members">
            <div className="flex flex-col gap-5">
              {communityDetails.members.map((member: any) => (
                <UserCard key={member._id} user={member} />
              ))}
            </div>
          </TabsContent>

          {/*//* Requests */}
          {communityDetails.createdBy._id.toString() ===
            userInfo._id.toString() && (
            <TabsContent value="requests">
              {communityDetails.requests.length > 0 ? (
                <div className="space-y-5">
                  <PendingRequests
                    communityId={communityDetails._id}
                    requests={communityDetails.requests}
                  />
                  <div className="mt-5 bg-dark-2 rounded-full h-0.5 w-full" />

                  <ApprovedRequests
                    communityId={communityDetails._id}
                    requests={communityDetails.requests}
                  />
                  <div className="mt-5 bg-dark-2 rounded-full h-0.5 w-full" />

                  <RejectedRequests
                    communityId={communityDetails._id}
                    requests={communityDetails.requests}
                  />
                </div>
              ) : (
                <p className="no-result">No requests</p>
              )}
            </TabsContent>
          )}
        </section>
      </Tabs>
    </section>
  );
}

//TODO>> Pending Requests Component
const PendingRequests = ({
  communityId,
  requests,
}: {
  communityId: string;
  requests: any;
}) => {
  const pendingRequests = requests.filter(
    (req: any) => req.status === "pending"
  );

  return (
    <section>
      <div className="space-y-4">
        {/*//* Title */}
        <h3 className="rounded-xl bg-dark-2 text-yellow-800 dark:text-yellow-400 px-2 py-1 w-fit">
          Pending
        </h3>

        {/*//* Pending Requests */}
        {pendingRequests.length > 0 ? (
          <div className="flex flex-col gap-5">
            {pendingRequests.map((req: any, index: string) => (
              <RequestCard
                key={req.user._id + index}
                communityId={communityId}
                user={req.user}
                status={req.status}
              />
            ))}
          </div>
        ) : (
          <p className="no-result">No users</p>
        )}
      </div>
    </section>
  );
};

//TODO>> Approved Requests Component
const ApprovedRequests = ({
  communityId,
  requests,
}: {
  communityId: string;
  requests: any;
}) => {
  const approvedRequests = requests.filter(
    (req: any) => req.status === "approved"
  );

  return (
    <section>
      <div className="space-y-4">
        {/*//* Title */}
        <h3 className="rounded-xl bg-dark-2 text-green-800 dark:text-green-500 px-2 py-1 w-fit">
          Approved
        </h3>

        {/*//* Pending Requests */}
        {approvedRequests.length > 0 ? (
          <div className="flex flex-col gap-5">
            {approvedRequests.map((req: any, index: string) => (
              <RequestCard
                key={req.user._id + index}
                communityId={communityId}
                user={req.user}
                status={req.status}
              />
            ))}
          </div>
        ) : (
          <p className="no-result">No users</p>
        )}
      </div>
    </section>
  );
};

//TODO>> Rejected Requests Component
const RejectedRequests = ({
  communityId,
  requests,
}: {
  communityId: string;
  requests: any;
}) => {
  const rejectedRequests = requests.filter(
    (req: any) => req.status === "rejected"
  );

  return (
    <section>
      <div className="space-y-4">
        {/*//* Title */}
        <h3 className="rounded-xl bg-dark-2 text-red-800 dark:text-red-500 px-2 py-1 w-fit">
          Rejected
        </h3>

        {/*//* Pending Requests */}
        {rejectedRequests.length > 0 ? (
          <div className="flex flex-col gap-5">
            {rejectedRequests.map((req: any, index: string) => (
              <RequestCard
                key={req.user._id + index}
                communityId={communityId}
                user={req.user}
                status={req.status}
              />
            ))}
          </div>
        ) : (
          <p className="no-result">No users</p>
        )}
      </div>
    </section>
  );
};
