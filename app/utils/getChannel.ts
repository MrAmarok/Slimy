import { ChannelType, Client, PermissionsBitField } from "discord.js";

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

export async function getChannelsWhereICanWrite(
  client: Client,
  guildId: string,
) {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.error(`Le serveur avec l'ID ${guildId} est introuvable.`);
    return null;
  }

  try {
    const channels = await guild.channels.fetch();
    const me = guild.members.me;

    const textChannels = channels
      .filter((channel): channel is Exclude<typeof channel, null> => {
        if (
          channel === null ||
          (channel.type !== ChannelType.GuildText &&
            channel.type !== ChannelType.GuildAnnouncement)
        ) {
          return false;
        }

        if (!me) return false;
        const permissions = channel.permissionsFor(me);

        return (
          permissions.has(PermissionsBitField.Flags.ViewChannel) &&
          permissions.has(PermissionsBitField.Flags.SendMessages)
        );
      })
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
