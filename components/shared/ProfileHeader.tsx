import Image from "next/image";

interface Props {
  user: {
    name: string;
    username: string;
    image: string;
    bio: string;
  };
}

export default function ProfileHeader({ user }: Props) {
  return (
    <div className="space-y-7">
      {/* img, name, username */}
      <div className="flex gap-2 items-center">
        {/* Img */}
        <div className="relative h-20 w-20">
          <Image
            src={user.image}
            alt="Profile-Img"
            fill
            className="rounded-full object-cover"
          />
        </div>
        {/* name, username */}
        <div className="space-y-1">
          <h3 className="text-heading3-bold text-light-1">{user.name}</h3>
          <p className="text-base-medium text-gray-1">@{user.username}</p>
        </div>
      </div>
      {/* bio */}
      <p className="max-w-lg text-base-regular text-light-2">{user.bio}</p>
      
      <div className="h-1 bg-dark-3 mt-14" />
    </div>
  );
}
