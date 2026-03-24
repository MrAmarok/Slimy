import { addSocialMedia } from "@/database";
import { CreateSocialMediaEntry } from "@/types";
import { MessageFlags, ModalSubmitInteraction } from "discord.js";

export async function addTwitchUser(interaction: ModalSubmitInteraction) {
  try {
    const { twitchUsername, channelId, messageContent } = {
      twitchUsername: interaction.fields.getTextInputValue("username_input"),
      channelId:
        interaction.fields.getStringSelectValues("channel_selector")[0],
      messageContent: interaction.fields.getTextInputValue("message_input"),
    };

    const data: CreateSocialMediaEntry = {
      platform: "twitch",
      username: twitchUsername,
      message: messageContent,
      channel_id: channelId,
    };

    const response = await addSocialMedia(data);

    if (response.success == false) {
      await interaction.reply({
        content: `❌ Failed to save Twitch announcement: ${response.message}`,
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
