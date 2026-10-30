import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, configured } from "./env";
export function getClient(preview = false) {
  if (!configured) return null;
  if (preview && !process.env.SANITY_API_READ_TOKEN)
    throw new Error(
      "Draft preview requires a server-side Sanity viewer token.",
    );
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !preview,
    perspective: preview ? "drafts" : "published",
    token: preview ? process.env.SANITY_API_READ_TOKEN : undefined,
  });
}
