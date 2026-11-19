"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui";

export function BirthdayPlanningVisibilityToggle({
  showBirthdayOnPlanning,
  hasDateOfBirth,
}: {
  showBirthdayOnPlanning: boolean;
  hasDateOfBirth: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("Account");
  const [on, setOn] = useState(showBirthdayOnPlanning);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(next: boolean) {
    setSaving(true);
    setError(null);

    const response = await fetch("/api/users/me/birthday-planning", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showBirthdayOnPlanning: next }),
    });
    const data = (await response.json()) as {
      error?: string;
      showBirthdayOnPlanning?: boolean;
    };
    setSaving(false);

    if (!response.ok) {
      setError(data.error ?? t("birthdayPlanningVisibilityError"));
      return;
    }

    setOn(data.showBirthdayOnPlanning ?? next);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium">{t("birthdayPlanningVisibilityLabel")}</p>
        <p className="text-xs text-stone-500">
          {hasDateOfBirth
            ? on
              ? t("birthdayPlanningVisibilityOn")
              : t("birthdayPlanningVisibilityOff")
            : t("birthdayPlanningVisibilityNoDate")}
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <Switch
        checked={on}
        onChange={(next) => void toggle(next)}
        label={t("birthdayPlanningVisibilityLabel")}
        disabled={saving || !hasDateOfBirth}
      />
    </div>
  );
}