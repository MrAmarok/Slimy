import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  TextChannel,
  ChannelType,
  StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "@/types";
import { StringSelectMenuOptionBuilder } from "@discordjs/builders";
import { ServiceType } from "@/types";

export function socialMediaWatcher(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("social_media_watcher")
    .setDescription("Configurer un social media Watcher avec username public")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel où envoyer les notifications")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    );

  async function execute(interaction: ChatInputCommandInteraction) {
    let channel = interaction.options.getChannel("channel") as TextChannel;

    if (!channel) {
      await interaction.reply("Error occure on the channel recuperation");
      return;
    }

    const socialType = new StringSelectMenuBuilder()
      .setCustomId(`select_social_${channel.id}_${interaction.user.id}`)
      .setPlaceholder("Select your social media")
      .addOptions(
        {
          label: ServiceType.Instagram,
          value: ServiceType.Instagram,
        },
        {
          label: ServiceType.TikTok,
          value: ServiceType.TikTok,
        },
        {
          label: ServiceType.Twitch,
          value: ServiceType.Twitch,
        },
        {
          label: ServiceType.Youtube,
          value: ServiceType.Youtube,
        }
      );
    await interaction.reply({
      content: "Select your social media you want to watch",
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          socialType
        ),
      ],
    });
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default socialMediaWatcher();
