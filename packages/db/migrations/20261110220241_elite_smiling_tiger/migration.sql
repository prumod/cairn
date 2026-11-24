ALTER TABLE "user_access" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
UPDATE "user_access" SET "status" = 'approved' WHERE "approved" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "user_access_one_administrator" ON "user_access" ("administrator") WHERE "administrator";--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_status_check" CHECK ("status" in ('pending', 'approved', 'revoked'));