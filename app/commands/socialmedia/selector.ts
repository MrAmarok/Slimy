import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { SlashCommand } from "@/types";

function socialMediaSelector(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("socialmedia_selector")
    .setDescription("Select a social media platform")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async function execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("social_media_selector")
      .setPlaceholder("Choisis une plateforme sociale...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Twitch")
          .setDescription("Stream sur Twitch")
          .setValue("twitch")
          .setEmoji("📺"),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    await interaction.reply({
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default socialMediaSelector();
