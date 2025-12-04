import { ServiceName, SocialMedia } from "@prisma/client";

export type SocialMediaTable = SocialMedia;

export const ServiceType = ServiceName;

export type SocialMInsert = Omit<SocialMediaTable, "uuid" | "created_at">;

export type GetUserOfSM = Omit<
  SocialMediaTable,
  "uuid" | "server_id" | "created_at"
>;