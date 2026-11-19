import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonError, unauthorized } from "@/lib/api";
import { birthdayPlanningVisibilitySchema } from "@/lib/validations";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const parsed = birthdayPlanningVisibilitySchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { showBirthdayOnPlanning: parsed.data.showBirthdayOnPlanning },
    select: { showBirthdayOnPlanning: true },
  });

  return Response.json({ showBirthdayOnPlanning: updated.showBirthdayOnPlanning });
}