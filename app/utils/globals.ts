import { StreamInfo, UserSession } from "@/types";

export const states = { streamInfos: [] as StreamInfo[] };

export const userSessions: UserSession = {
  twitchToken: "",
  twitchClientId: process.env.TWITCH_CLIENT_ID || "",
};
