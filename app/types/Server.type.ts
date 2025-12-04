import { Server } from "@prisma/client";

export type ServerTable = Server;

export type ServerName = Omit<ServerTable, "id" | "created_at">;

export type ServerId = Omit<ServerTable, "name" | "created_at">;
