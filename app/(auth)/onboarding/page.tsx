import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
  const user = await currentUser();
  const userInfo: any = {};

  const userData = {
    id: userInfo?.id || user?.id || "",
    objectId: userInfo?._id?.toString() || "",
    username: userInfo?.username || user?.username || "",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl || "",
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col px-7 py-10 xs:px-10">
      <h1 className="text-heading2-bold">Onboarding</h1>
      <p className="text-subtle-medium mt-5">
        Complete your profile now to use Threads
      </p>

      <section className="bg-dark-2 px-5 py-7 mt-9 xs:p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </section>
  );
}
