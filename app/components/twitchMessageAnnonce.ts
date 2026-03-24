import { EmbedBuilder } from "discord.js";

interface TwitchStreamData {
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
}

export function twitchMessageAnnonce({
  game_name,
  started_at,
  thumbnail_url,
  title,
  user_login,
  user_name,
  viewer_count,
}: TwitchStreamData): EmbedBuilder {
  const imageUrl = thumbnail_url
    .replace("{width}", "1280")
    .replace("{height}", "720");

  const startDate = new Date(started_at);
  const formattedDate = `${startDate.getDate().toString().padStart(2, "0")}/${(startDate.getMonth() + 1).toString().padStart(2, "0")}/${startDate.getFullYear()} ${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`;

  const twitchUrl = `https://twitch.tv/${user_login}`;

  return new EmbedBuilder()
    .setColor("#9146FF")
    .setAuthor({
      name: `${user_name} is now live on Twitch!`,
      iconURL: "https://cdn-icons-png.flaticon.com/512/5968/5968819.png",
      url: twitchUrl,
    })
    .setTitle(title)
    .setURL(twitchUrl)
    .addFields(
      { name: "Game", value: game_name || "Unknown", inline: true },
      { name: "Viewers", value: viewer_count.toString(), inline: true },
    )
    .setImage(imageUrl)
    .setFooter({ text: ` • ${formattedDate}` });
}

// Exemple d'utilisation dans ton code Discord.js
/*
client.on('messageCreate', async (message) => {
    if (message.content === '!testembed') {
        const embed = createTwitchNotificationEmbed(streamData);
        await message.channel.send({ embeds: [embed] });
    }
});
*/
