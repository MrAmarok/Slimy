import {
  ChatInputCommandInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { modalTwitch } from "../components/modalTwitch.js";
import { addSocialMedia, deleteSocialMedia } from "@/database";
import { CreateSocialMediaEntry } from "@/types/SQLTable.js";

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
  if (interaction.customId === "social_media_selector") {
    try {
      const selectedStyle = interaction.values[0];
      const modal = await modalTwitch(
        selectedStyle,
        interaction.client,
        interaction.guildId!,
      );
      await interaction.showModal(modal);
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "❌ Error occurred while displaying the form!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
  if (interaction.customId === "del_twitch_user_selector") {
    try {
      const selectedUser = interaction.values;
      console.log(
        `Selected Twitch users to delete: ${selectedUser.join(", ")}`,
      );

      selectedUser.map(async (username) => {
        const res = await deleteSocialMedia(username);
        console.log(`Deleted Twitch user: ${username}, Result: ${res}`);
      });

      await interaction.reply({
        content: `Twitch users deleted: ${selectedUser.join(", ")}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Error occurred while deleting Twitch users!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

export async function modalSubmitInteraction(
  interaction: ModalSubmitInteraction,
) {
  if (interaction.customId.startsWith("modal_twitch")) {
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
}
