import UserCard from "@/components/cards/UserCard";
import { fetchAllUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function SearchPage() {
  const user = await currentUser();
  if (!user) return null;

  const { users, nofPages } = await fetchAllUsers({ userId: user.id });
  return (
    <section>
      <h1 className="text-heading1-bold">Search</h1>

      <div className="mt-14">
        <div className="flex flex-col gap-10">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
}
