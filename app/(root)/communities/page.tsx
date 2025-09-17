import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Searchbar from "@/components/shared/Searchbar";
import PaginationPage from "@/components/ui/pagination";

export default async function CommunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ pageNumber: string; query: string }>;
}) {
  const { pageNumber, query } = await searchParams;
  const { communities, nofPages } = await fetchCommunities({
    pageNumber: parseInt(pageNumber) || 1,
    pageSize: 5,
    searchString: query || "",
    sortBy: -1,
  });

  const { userId } = await auth();
  if (!userId) return null;
  const userInfo = await fetchUser(userId);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="space-y-10">
      {/*//! Search communities */}
      <Searchbar query={query} route={'/communities'} type={"communities"}/>
      
      {/*//! All Communities */}
      {communities.length > 0 ? (
        <div className="flex max-sm:flex-col sm:flex-wrap gap-10">
          {communities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              userIdObject={userInfo?._id}
            />
          ))}
        </div>
      ) : (
        <p className="no-result">No Communities</p>
      )}

      {/*//! Pagination */}
      <PaginationPage pageNumber={parseInt(pageNumber)} nofPages={nofPages} query={query}/>
    </section>
  );
}
