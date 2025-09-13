import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function CommunitiesPage() {
  const { communities, nofPages } = await fetchCommunities({
    pageNumber: 1,
    pageSize: 20,
    searchString: "",
    sortBy: -1,
  });

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  return (
   <section>
      {/*//! All Communities */}
       {communities.length > 0 ? <div className="flex max-sm:flex-col sm:flex-wrap gap-10">
        {communities.map((community) => (
          <CommunityCard
            key={community._id}
            community={community}
            userIdObject={userInfo._id}
          />
        ))}
      </div> : <p className="no-result">No communities</p>}
    </section>
    
  );
}
