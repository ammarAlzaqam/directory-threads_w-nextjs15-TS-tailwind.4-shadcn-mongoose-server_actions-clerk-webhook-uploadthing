import { UserRoundCheck, UserRoundX, X } from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export const communityReqStatus = [
  {
    icon: "UserRoundCheck",
    label: "Approve",
    action: "approved",
    theme: "text-green-800 shadow-sm shadow-green-800/80 dark:shadow-green-800/60",
  },

  {
    icon: "UserRoundX",
    label: "Reject",
    action: "rejected",
    theme: "text-orange-700 shadow-sm shadow-orange-700/80 dark:shadow-yellow-800/60",
  },

  {
    icon: "X",
    label: "Remove",
    action: "remove",
    theme: "text-red-800 shadow-sm shadow-red-800/80 dark:shadow-red-800/60",
  },
];
