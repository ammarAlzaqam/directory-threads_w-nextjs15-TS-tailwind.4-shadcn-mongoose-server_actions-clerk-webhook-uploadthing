import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  deleteMemberFromCommunity,
  updateCommunity,
} from "@/lib/actions/community.action";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import svix from "svix";

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organization.updated"
  | "organization.deleted"
  | "organizationMembership.deleted";

interface Event {
  data: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    logo_url: string;
    created_by: string;
    organization: { id: string };
    public_user_data: { user_id: string };
  };
  object: "event";
  type: EventType;
}

export async function POST(req: Request) {
  const payload = await req.json();
  const header = await headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  const wh = new svix.Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & svix.WebhookRequiredHeaders
    ) as Event;
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  if (eventType === "organization.created") {
    const { id, name, slug, image_url, logo_url, created_by } =
      evnt?.data ?? {};

    try {
      await createCommunity({
        id,
        name,
        username: slug,
        image: logo_url || image_url,
        createdBy: created_by,
      });

      return NextResponse.json(
        { message: "Community created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  if (eventType === "organizationInvitation.created") {
    try {
      console.log("Invitation created: ", evnt?.data);

      NextResponse.json(
        { message: "Invitation created successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  if (eventType === "organizationMembership.created") {
    try {
      const {
        organization: { id: organizationId },
        public_user_data: { user_id: userId },
      } = evnt?.data;

      await addMemberToCommunity(organizationId, userId);

      return NextResponse.json(
        { message: "Invitation accepted" },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  if (eventType === "organization.updated") {
    const { id, name, slug, logo_url } = evnt?.data;
    try {
      await updateCommunity({
        name,
        username: slug,
        image: logo_url,
        communityId: id,
      });
      return NextResponse.json(
        { message: "Community updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  if (eventType === "organization.deleted") {
    try {
      const { id } = evnt?.data;

      await deleteCommunity(id);
      return NextResponse.json(
        { message: "Community deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  if (eventType === "organizationMembership.deleted") {
    try {
      const {
        organization: { id: communityId },
        public_user_data: { user_id: userId },
      } = evnt?.data;

      await deleteMemberFromCommunity(communityId, userId);

      return NextResponse.json(
        { message: "User delete from community successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
