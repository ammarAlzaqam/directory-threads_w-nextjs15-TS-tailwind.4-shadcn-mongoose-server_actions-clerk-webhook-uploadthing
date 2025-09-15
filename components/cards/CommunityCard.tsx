import Image from "next/image";
import { Button } from "../ui/button";
import TipTitle from "../ui/tooltip";
import Link from "next/link";
import CommunityBioEdit from "../shared/CommunityBioEdit";

type User = {
  _id: string;
  image: string;
  name: string;
};

interface Props {
  community: {
    name: string;
    username: string;
    image: string;
    bio: string;
    members: User[];
    createdBy: string;
  };
  userIdObject: string;
}

export default function CommunityCard({ community, userIdObject }: Props) {
  return (
    <div className="px-4 py-5 bg-dark-3 w-full sm:w-[380px] rounded-lg">
      <div className="flex flex-col gap-5">
        {/*//! Info (image, text) */}
        <div className="flex items-center gap-3">
          {/*//* Image */}
          <div className="relative w-12 h-12">
            <Image
              src={community.image}
              alt={"community_img"}
              fill
              className="rounded-full object-cover"
            />
          </div>
          {/*//* text (name, slug) */}
          <div>
            <h3 className="text-base-medium">{community.name}</h3>
            <p className="text-small-medium text-gray-1">
              @{community.username}
            </p>
          </div>
        </div>

        {/*//! Bio (text, edit button) */}
        <div className="flex items-center gap-2">
          <p className="max-w-11/12 text-subtle-medium text-gray-1">{community.bio}</p>
          {community.createdBy.toString() === userIdObject && (
            <TipTitle message="Edit">
              <CommunityBioEdit
                currentUserId={userIdObject.toString()}
                community={JSON.parse(JSON.stringify(community))}
              />
            </TipTitle>
          )}
        </div>

        {/*//! Data (button, members) */}
        <div className="flex justify-between items-center">
          {/*//* view Button */}
          <Button
            size="sm"
            className="!text-small-medium text-light-1 bg-primary-500"
          >
            View
          </Button>

          {/*//* members Images */}
          {community.members.length > 0 && community.members.length < 11 && (
            <div
              className={`flex ${
                community.members.length <= 6 ? "-space-x-2" : "-space-x-3.5"
              }`}
            >
              {community.members.map((member: any) => (
                <TipTitle key={member._id} message={member.name}>
                  <Link
                    href={`/profile/${member.id}`}
                    className="relative w-7 h-7"
                  >
                    <Image
                      src={member.image}
                      alt={"community_img"}
                      fill
                      className="rounded-full object-cover hover:z-30"
                    />
                  </Link>
                </TipTitle>
              ))}
            </div>
          )}

          {/*//* nofMembers */}
          {community.members.length > 10 && (
            <p className="text-subtle-medium text-light-4">
              {community.members.length} member
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
