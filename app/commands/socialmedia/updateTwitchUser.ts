import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import { getSocialMediaByPlatform } from "@/database/tables/socialMedia.js";
import { SlashCommand } from "@/types";

function updateTwitchUser(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("twitch_update_user")
    .setDescription("Update a Twitch user configuration in the database")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async function execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const res = await getSocialMediaByPlatform("twitch");
    if (res.length === 0) {
      await interaction.reply({
        content: "❌ No Twitch users found in the database to update!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("update_twitch_user_selector")
        .setPlaceholder("Choose Twitch user to update...")
        .setMaxValues(1)
        .addOptions(
          ...res.map((entry) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(entry.username)
              .setDescription(`Channel ID: ${entry.channel_id}`)
              .setValue(entry.username)
              .setEmoji("📺"),
          ),
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu,
      );

      await interaction.reply({
        components: [row],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  return { data: data, execute };
}

export default updateTwitchUser();
