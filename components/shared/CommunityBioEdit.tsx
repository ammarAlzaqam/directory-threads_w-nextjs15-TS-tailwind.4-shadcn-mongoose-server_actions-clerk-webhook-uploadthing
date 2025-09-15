"use client";

import { Pen } from "lucide-react";
import { useState } from "react";
import CommunityEdit from "../forms/CommunityEdit";

export default function CommunityBioEdit({
  currentUserId,
  community,
}: {
  currentUserId: string;
  community: any;
}) {
  const [open, set] = useState(false);
  return (
    <>
      <Pen
        onClick={() => set(true)}
        className="size-4 text-primary-500 cursor-pointer"
      />
      {open && (
        <div className="z-100 fixed inset-0 flex justify-center items-center" onClick={() => set(false)}>
          <div className="w-11/12 sm:w-2/3 lg:w-1/2 bg-dark-2 px-2 sm:px-4 py-4 rounded-md shadow-sm shadow-gray-1 dark:shadow-primary-500" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-heading4-medium">Edit Community</h1>
            <CommunityEdit
              currentUserId={currentUserId}
              community={community}
              set={set}
            />
            
          </div>
        </div>
      )}
    </>
  );
}
