CREATE TABLE "SiteMotd" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteMotd_pkey" PRIMARY KEY ("id")
);