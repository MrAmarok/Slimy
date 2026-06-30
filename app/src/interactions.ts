import {
  ChatInputCommandInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

import { socialMedia, deleteTwitchUser, updateTwitch } from "@/src/selectors/index.js";
import { addTwitchUser, updateTwitchUserModal } from "@/src/modals/index.js";

export async function chatInputInteraction(
  interaction: ChatInputCommandInteraction,
) {
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(
      `❌ No command matching ${interaction.commandName} was found.`,
    );
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Error occurred while executing the command!",
      flags: MessageFlags.Ephemeral,
    });
  }
}

export async function stringSelectMenuInteraction(
  interaction: StringSelectMenuInteraction,
) {
  if (interaction.customId === "social_media_selector")
    socialMedia(interaction);
  if (interaction.customId === "del_twitch_user_selector")
    deleteTwitchUser(interaction);
  if (interaction.customId === "update_twitch_user_selector")
    updateTwitch(interaction);
}

export async function modalSubmitInteraction(
  interaction: ModalSubmitInteraction,
) {
  if (interaction.customId.startsWith("modal_twitch"))
    addTwitchUser(interaction);
  if (interaction.customId.startsWith("modal_update_twitch"))
    updateTwitchUserModal(interaction);
}
