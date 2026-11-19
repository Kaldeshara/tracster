import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { forbidden, jsonError, unauthorized } from "@/lib/api";
import { canManageSettings } from "@/lib/roles";
import { SITE_MOTD_ID, getSiteMotdMessage } from "@/lib/motd";
import {
  getSiteSettings,
  serializeSiteSettings,
  SITE_SETTINGS_ID,
} from "@/lib/site-settings";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const [settings, messageOfTheDay] = await Promise.all([
    getSiteSettings(),
    getSiteMotdMessage(),
  ]);
  return Response.json({ settings, messageOfTheDay });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  if (!(await canManageSettings(user.id))) {
    return forbidden();
  }

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const { messageOfTheDay, ...siteFields } = parsed.data;
  const settings = await prisma.$transaction(async (tx) => {
    const updated = await tx.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: {
        id: SITE_SETTINGS_ID,
        ...siteFields,
      },
      update: siteFields,
    });
    if (messageOfTheDay !== undefined) {
      const trimmed = messageOfTheDay.trim();
      await tx.siteMotd.upsert({
        where: { id: SITE_MOTD_ID },
        create: { id: SITE_MOTD_ID, message: trimmed },
        update: { message: trimmed },
      });
    }
    return updated;
  });

  const motd =
    messageOfTheDay !== undefined ? messageOfTheDay.trim() : await getSiteMotdMessage();
  return Response.json({
    settings: serializeSiteSettings(settings),
    messageOfTheDay: motd,
  });
}
