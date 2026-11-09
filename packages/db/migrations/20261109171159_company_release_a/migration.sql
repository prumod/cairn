CREATE TABLE "company_alvara" (
	"company_id" uuid,
	"subcategoria" text,
	"classe" smallint NOT NULL,
	CONSTRAINT "company_alvara_pkey" PRIMARY KEY("company_id","subcategoria"),
	CONSTRAINT "company_alvara_classe_range" CHECK ("classe" BETWEEN 1 AND 9)
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(200) NOT NULL,
	"morada" varchar(500) NOT NULL,
	"location_label" varchar(100) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"radius_km" smallint DEFAULT 50 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_latitude_range" CHECK ("latitude" BETWEEN -90 AND 90),
	CONSTRAINT "company_longitude_range" CHECK ("longitude" BETWEEN -180 AND 180),
	CONSTRAINT "company_radius_km_range" CHECK ("radius_km" BETWEEN 1 AND 200)
);
--> statement-breakpoint
DROP TABLE "company_profile";--> statement-breakpoint
ALTER TABLE "user_access" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "user_access" ADD CONSTRAINT "user_access_company_id_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "company_alvara" ADD CONSTRAINT "company_alvara_company_id_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE;