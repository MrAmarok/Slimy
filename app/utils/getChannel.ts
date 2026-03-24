import { ChannelType, Client } from "discord.js";

type ChannelInfo = {
  id: string;
  name: string;
  type: ChannelType;
};

export async function getGuildChannels(client: Client, guildId: string) {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.error(`Le serveur avec l'ID ${guildId} est introuvable.`);
    return null;
  }

  try {
    const channels = await guild.channels.fetch();
    const textChannels = channels
      .filter(
        (channel): channel is Exclude<typeof channel, null> =>
          channel !== null &&
          (channel.type === ChannelType.GuildText ||
            channel.type === ChannelType.GuildAnnouncement),
      )
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }));

    return textChannels;
  } catch (error) {
    console.error("Erreur lors de la récupération des salons :", error);
    return null;
  }
}
