import { formatCount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import TipTitle from "../ui/tooltip";
import { Button } from "../ui/button";
import { Delete, Trash, Trash2 } from "lucide-react";
import DeleteThread from "../shared/DeleteThread";

type Author = {
  name: string;
  image: string;
  id: string;
  _id: string;
};

type Community = {
  id: string;
  name: string;
  image: string;
};

type Comment = {
  author: {
    id: string;
    name: string;
    image: string;
  };
};

interface Props {
  thread: {
    _id: string;
    author: Author;
    parentId: string;
    text: string;
    community: Community;
    createdAt: string;
    children: Comment[];
  };
  user: Author;
  isComment?: boolean;
}

export default function ThreadCard({ thread, isComment = false, user }: Props) {
  const {
    _id: threadId,
    author,
    parentId,
    text,
    community,
    createdAt,
    children: comments,
  } = thread;

  const commentsUniqueAuthor = [
    ...new Set(comments.map((comment) => comment.author)),
  ];

  return (
    <article
      className={`${
        isComment && parentId ? "px-0 xs:px-7" : "bg-dark-3 p-7"
      } flex-1 animate-zoom-in rounded-lg`}
    >
      <div className="flex gap-5 relative">
        {/*//! Profile img and horizontal line */}
        <div className="flex flex-col items-center">
          <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
            <Image
              src={author.image || user?.image || ""}
              alt="profile-image"
              fill
              className="rounded-full"
            />
          </Link>
          <div className="thread-card_bar !bg-dark-4" />
        </div>
        {/*//! name, text & icons */}
        <div
          className={`flex flex-col flex-1 ${
            isComment && !!parentId && "mb-10"
          }`}
        >
          <div className="flex justify-between">
            <Link href={`/profile/${author.id}`}>
              <h3 className="text-base-semibold text-light-1">
                {author.name || user?.name}
              </h3>
            </Link>

            {/*//! Delete Thread Button */}
            {author._id.toString() === user?._id.toString() && (
              <DeleteThread
                deleteType={isComment && parentId ? "comment" : "thread"}
                threadId={thread._id.toString()}
                userId={user?._id.toString() || ""}
              />
            )}
          </div>

          <p className="mt-2 text-small-regular text-light-2">{text}</p>

          {/*// Icons */}
          <div
            className={`flex flex-col mt-5 gap-3 ${
              comments.length && !isComment && !parentId && "mb-5"
            }`}
          >
            <div className="flex gap-3.5">
              <Image
                src="/assets/heart-gray.svg"
                alt="heart"
                width={24}
                height={24}
                className="cursor-pointer object-cover"
              />
              <Link href={`/thread/${threadId}`}>
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </Link>

              <Image
                src="/assets/repost.svg"
                alt="repost"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/share.svg"
                alt="share"
                width={24}
                height={24}
                className="cursor-pointer object-contain"
              />
            </div>
            {isComment && comments.length !== 0 && (
              <Link href={`/thread/${threadId}`}>
                <p className="text-subtle-medium text-gray-1">
                  {formatCount(comments.length, "reply", "replies")}
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/*//! Show replies data */}
      {!isComment && !parentId && comments && (
        <div className="flex gap-2 items-center">
          {commentsUniqueAuthor.length < 12 && (
            <div className="flex items-center -space-x-3">
              {commentsUniqueAuthor.map((author) => (
                <Link key={author.id} href={`/profile/${author.id}`}>
                  <TipTitle message={author.name}>
                    <Image
                      src={author.image}
                      alt="profile-img"
                      width={28}
                      height={28}
                      className="rounded-full hover:scale-150 hover:z-50 transition"
                    />
                  </TipTitle>
                </Link>
              ))}
            </div>
          )}
          <Link
            href={`/thread/${threadId}`}
            className="text-subtle-medium text-gray-1"
          >
            {formatCount(comments.length, "reply", "replies")}
          </Link>
        </div>
      )}
    </article>
  );
}
