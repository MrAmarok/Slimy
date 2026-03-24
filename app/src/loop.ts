import {
  getSocialMediaByPlatform,
  updateSocialMediaMessageSend,
} from "@/database";
import { refreshTwitchToken } from "@/server/session.js";
import { UserSession } from "@/types";
import { twitchMessageAnnonce } from "@/components/twitchMessageAnnonce.js";
import { Client, TextChannel } from "discord.js";

export async function twitchCallLoop(
  userSessions: UserSession,
  client: Client,
) {
  const twitchInfo = await getSocialMediaByPlatform("twitch");
  const results = await Promise.all(
    twitchInfo.map(async (info) => {
      const res = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${info.username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userSessions.twitchToken}`,
            "Client-Id": userSessions.twitchClientId,
          },
        },
      );
      if (!res.ok) return false;
      const data = await res.json();

      if (data.data && data.data.length === 0 && info.message_sended) {
        await updateSocialMediaMessageSend(info.username, false);
        return true;
      } else if (data.data && data.data.length === 0 && !info.message_sended)
        return true;

      if (data.data && data.data.length > 0 && !info.message_sended) {
        await updateSocialMediaMessageSend(info.username, true);
        const message = twitchMessageAnnonce({... data.data[0], bot_name: client.user?.username || "Slimy Bot"});
        
        client.channels.fetch(info.channel_id).then((channel) => {
          if (channel && channel.isTextBased()) {
            (channel as TextChannel).send({
              content: `${info.message}`,
              embeds: [message],
            });
          }
        });
        
        console.log(`\n📢 ${info.username} is live! Announcement sent.`);
        return true;
      }
    }),
  );
  if (results.includes(false)) {
    console.log("\n⚠️ Twitch token might be expired, refreshing...");
    await refreshTwitchToken(userSessions);
  }
}
