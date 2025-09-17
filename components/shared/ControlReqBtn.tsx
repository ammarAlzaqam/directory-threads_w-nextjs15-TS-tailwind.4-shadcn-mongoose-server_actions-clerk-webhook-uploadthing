"use client";

import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { Confirm } from "../ui/alert-dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { handelCommunityRequest } from "@/lib/actions/community.action";
import { usePathname } from "next/navigation";

type Action = "remove" | "approved" | "rejected";
type State = {
  icon: keyof typeof Icons;
  label: string;
  action: Action;
  theme: string;
};

interface Props {
  communityId: string;
  userId: string;
  state: State;
  userReqStatus: "pending" | "rejected" | "approved";
}

export default function ControlReqBtn({
  communityId,
  userId,
  state,
  userReqStatus,
}: Props) {
  if (state.action === userReqStatus) return null;

  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const Icon: any = Icons[state.icon];

  const handleReq = async () => {
    try {
      setLoading(true);

      await handelCommunityRequest({communityId, userId, action:state.action, path});

      toast.success(`${state.label} user successfully.`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Some went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Confirm
      confirmMsg={state.label}
      message={
        <span>
          It will be{" "}
          <span className={`${state.theme} !shadow-none !bg-none`}>
            {state.label.toLowerCase()}
          </span>{" "}
          this user
        </span>
      }
      onConfirm={handleReq}
    >
      <Button
        disabled={loading}
        className={`max-sm:size-7 bg-dark-2 hover:bg-dark-2/80 !text-small-medium text-light-2 cursor-pointer ${state.theme}`}
      >
        <span className="max-sm:hidden">{state.label}</span>
        {loading ? (
          <Icons.CircleDotDashed className="animate-spin" />
        ) : (
          <Icon />
        )}
      </Button>
    </Confirm>
  );
}
