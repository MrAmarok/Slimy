import { updateAllSocialMediaInformation } from "@/database";
import { UpdateSocialMediaEntry } from "@/types";
import { MessageFlags, ModalSubmitInteraction } from "discord.js";

export async function updateTwitchUserModal(
  interaction: ModalSubmitInteraction,
) {
  try {
    const customIdPrefix = "modal_update_";
    const customIdPayload = interaction.customId.startsWith(customIdPrefix)
      ? interaction.customId.slice(customIdPrefix.length)
      : "";
    const firstSeparatorIndex = customIdPayload.indexOf("_");

    if (firstSeparatorIndex === -1) {
      await interaction.reply({
        content: "❌ Invalid modal identifier format.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const selectedStyle = customIdPayload.slice(0, firstSeparatorIndex);
    const oldUsername = customIdPayload.slice(firstSeparatorIndex + 1);

    const { twitchUsername, channelId, messageContent } = {
      twitchUsername: interaction.fields.getTextInputValue("username_input"),
      channelId:
        interaction.fields.getSelectedChannels("channel_selector")?.first()?.id,
      messageContent: interaction.fields.getTextInputValue("message_input"),
    };

    if (!channelId) {
      await interaction.reply({
        content: "❌ Please select a valid channel!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const data: UpdateSocialMediaEntry = {
      platform: selectedStyle,
      message_sended: false,
      username: twitchUsername,
      message: messageContent,
      channel_id: channelId,
    };

    const response = await updateAllSocialMediaInformation(oldUsername, data);

    if (!response) {
      await interaction.reply({
        content: `❌ Failed to save Twitch announcement: ${twitchUsername}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: `✅ Twitch announcement saved for: ${twitchUsername} with message: ${messageContent} `,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Error occurred while processing the form!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
