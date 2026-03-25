import {
  getSocialMediaByPlatform,
  updateSocialMediaMessageSend,
} from "@/database";
import { refreshTwitchToken } from "@/server/session.js";
import { twitchMessageAnnonce } from "@/components/twitchMessageAnnonce.js";
import { Client, TextChannel } from "discord.js";
import { states, userSessions } from "@/utils/globals.js";

export async function twitchCallLoop(client: Client) {
  const twitchInfo = await getSocialMediaByPlatform("twitch");
  states.streamInfos = states.streamInfos.filter((info) => {
    return twitchInfo.some((s) => s.username === info.username);
  });
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
      if (!res.ok) {
        if (res.status === 401) {
          console.error(
            `❌ Unauthorized: Twitch token might be expired. Status: ${res.statusText}`,
          );
          return false;
        } else {
          console.error(
            `❌ Failed to fetch Twitch stream info for ${info.username}: ${res.statusText}`,
          );
          return true;
        }
      }
      const data = await res.json();

      if (data.data && data.data.length === 0 && !info.message_sended) {
        return true;
      } else if (data.data && data.data.length === 0 && info.message_sended) {
        await updateSocialMediaMessageSend(info.username, false);
        if (
          states.streamInfos.some((stream) => stream.username === info.username)
        ) {
          states.streamInfos = states.streamInfos.filter(
            (stream) => stream.username !== info.username,
          );
        }
        return true;
      } else if (data.data && data.data.length > 0 && !info.message_sended) {
        states.streamInfos.push({
          username: info.username,
          link: `https://www.twitch.tv/${info.username}`,
          title: data.data[0].title,
        });
        await updateSocialMediaMessageSend(info.username, true);
        const message = twitchMessageAnnonce({
          ...data.data[0],
          bot_name: client.user?.username || "Slimy Bot",
        });
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
