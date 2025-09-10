import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import PaginationPage from "@/components/ui/pagination";
import { fetchAllUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ pageNumber: string; query: string }>;
}) {
  const { pageNumber, query } = await searchParams;

  const user = await currentUser();
  if (!user) return null;

  const { users, nofPages } = await fetchAllUsers({
    userId: user.id,
    pageNumber: parseInt(pageNumber),
    pageSize: 2,
    searchString: query,
  });
  return (
    <section>
      <h1 className="text-heading1-bold">Search</h1>

      {/*//! Search */}
      <div className="mt-10">
        <Searchbar route="/search" type="users" query={query} />
      </div>

      <div className="mt-14">
        <div className="flex flex-col gap-10">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>

      <PaginationPage
        nofPages={nofPages}
        pageNumber={parseInt(pageNumber)}
        query={query}
      />
    </section>
  );
}
