-- Per-member opt-in for showing their birthday on the association planning.
ALTER TABLE "User" ADD COLUMN "showBirthdayOnPlanning" BOOLEAN NOT NULL DEFAULT true;