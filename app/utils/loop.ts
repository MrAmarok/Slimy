import { getSocialMediaByPlatform } from "@/database";
import { UserSession } from "@/types";

export async function twitchCallLoop(userSessions: UserSession) {
  const twitchInfo = await getSocialMediaByPlatform("twitch");

  twitchInfo.map(async (info) => {
    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${info.username}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userSessions.twitchToken}`,
          "Client-Id": userSessions.twitchClientId,
        },
      },
    );
    const data = await res.json();
    console.log(`Twitch stream status for ${info.username}:`, data);
  });
}
