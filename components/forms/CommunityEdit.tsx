import { CommunityValidationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ShipWheel } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { updateCommunity } from "@/lib/actions/community.action";

type Community = {
  id: string;
  name: string;
  image: string;
  username: string;
  bio: string;
  createdBy: string;
};

interface Props {
  currentUserId: string;
  community: Community;
  set: (value: boolean) => void;
}

export default function CommunityEdit({
  currentUserId,
  community: { id, name, image, username, bio, createdBy },
  set,
}: Props) {
  if (createdBy !== currentUserId) return null;

  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const form = useForm({
    defaultValues: {
      bio: bio,
    },
    resolver: zodResolver(CommunityValidationSchema),
  });

  const onSubmit = form.handleSubmit(async ({ bio: newBio }) => {
    try {
      setLoading(true);
      await updateCommunity({
        communityId: id,
        name,
        image,
        username,
        bio: newBio,
        path,
      });

      set(true);
      toast.success("Community bio has been successfully modified");
    } catch (error: any) {
      toast.error(`Failed to modify community bio: ${error.message}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  });
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-5 p-2 sm:p-4 bg-dark-2"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <p className="text-tiny-medium sm:text-subtle-medium text-light-2 line-clamp-1">
                  Bio{" "}
                  <span className="text-light-4">(( {name} community ))</span>
                </p>
              </FormLabel>
              <FormControl>
                <Textarea
                  cols={8}
                  {...field}
                  className="no-focus account-form_input min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          className={`account-form_btn`}
          data-state={loading}
        >
          {loading ? <ShipWheel className="animate-spin" /> : "Edit"}
        </Button>
      </form>
    </Form>
  );
}
