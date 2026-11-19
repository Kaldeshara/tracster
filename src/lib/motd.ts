import { prisma } from "@/lib/db";

export const SITE_MOTD_ID = "default";
export const SITE_MOTD_MAX_LENGTH = 2000;

export async function getMessageOfTheDay(): Promise<string | null> {
  const row = await prisma.siteMotd.findUnique({
    where: { id: SITE_MOTD_ID },
    select: { message: true },
  });
  if (!row) {
    return null;
  }
  const trimmed = row.message.trim();
  return trimmed || null;
}

export async function getSiteMotdMessage(): Promise<string> {
  const row = await prisma.siteMotd.findUnique({
    where: { id: SITE_MOTD_ID },
    select: { message: true },
  });
  return row?.message ?? "";
}