import { GetUserOfSM } from "@/types";
import { Client } from "discord.js";

export async function tiktokScrapper(bot: Client, socialMedia: GetUserOfSM) {
  try {
    const channel = bot.channels.fetch(socialMedia.channel_id);
    if (!channel) return;


    // const res = await fetch(
    //   `https://www.tiktok.com/@${socialMedia.username}`
    // );

    // const html = await res.text();

    // const jsonMatch = html.match(
    //   /<script id="__NEXT_DATA__" type="application\/json">(.+)<\/script>/
    // );

    // console.log("JsonData:", html);
    // if (!jsonMatch) return;

    // const jsonData = JSON.parse(jsonMatch[1]);

    //     const videos =
    //       jsonData.props.pageProps.userData.user.videoList?.videos || [];

    //     if (videos.length === 0) return;

    //     const latestVideo = videos[0];
    //     const latestId = latestVideo.id || latestVideo.videoId;

    //     if (latestId !== socialMedia.last_video) {
    //       config.lastVideoId = latestId;
    //       await channel.send(
    //         `${config.message}\nhttps://www.tiktok.com/@${config.username}/video/${latestId}`
    //       );
    //     }
  } catch (err) {
    console.error("Erreur polling TikTok:", err);
  }
}