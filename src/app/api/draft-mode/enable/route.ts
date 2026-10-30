import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getClient } from "@/sanity/client";
export async function GET(request: Request) {
  if (!process.env.SANITY_API_READ_TOKEN)
    return new Response("Draft preview is not configured.", { status: 503 });
  const client = getClient(true);
  if (!client) return new Response("CMS is not configured.", { status: 503 });
  const handler = defineEnableDraftMode({ client });
  return handler.GET(request);
}
