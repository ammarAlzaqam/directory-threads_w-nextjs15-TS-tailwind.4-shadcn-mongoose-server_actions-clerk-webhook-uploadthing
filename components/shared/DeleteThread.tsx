"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import { Loader, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ConfirmDelete from "../ui/alert-dialog";
import TipTitle from "../ui/tooltip";
import toast from "react-hot-toast";

interface Props {
  threadId: string;
  userId: string;
  deleteType?: string;
}

export default function DeleteThread({
  threadId,
  userId,
  deleteType = "thread",
}: Props) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const handelDeleteThread = async () => {
    try {
      setLoading(true);
      await deleteThread(threadId, path);
      toast.success("The thread has been successfully deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete thread")
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDelete onConfirm={handelDeleteThread} deleteType={deleteType}>
      <Button
        disabled={loading}
        className={`cursor-pointer bg-transparent hover:bg-transparent !p-0 h-fit text-logout-btn/80 hover:text-destructive`}
      >
        {loading ? (
          <Loader className="animate-spin max-sm:size-5" />
        ) : (
          <Trash className=" max-sm:size-5" />
        )}
      </Button>
    </ConfirmDelete>
  );
}
