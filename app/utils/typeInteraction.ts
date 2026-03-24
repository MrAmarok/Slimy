import {
  ChatInputCommandInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { modalTwitch } from "../components/modalTwitch.js";
import { addSocialMedia, deleteSocialMedia } from "../server/index.js";

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
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Erreur lors de l'exécution !",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "Erreur lors de l'exécution !",
        flags: MessageFlags.Ephemeral,
      });
    }
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
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Erreur lors de l'affichage du formulaire !",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Erreur lors de l'affichage du formulaire !",
          flags: MessageFlags.Ephemeral,
        });
      }
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
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Erreur lors de la suppression des utilisateurs Twitch !",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Erreur lors de la suppression des utilisateurs Twitch !",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
}

export async function modalSubmitInteraction(
  interaction: ModalSubmitInteraction,
) {
  if (interaction.customId.startsWith("modal_twitch")) {
    try {
      const twitchUsername =
        interaction.fields.getTextInputValue("username_input");
      const channelId =
        interaction.fields.getStringSelectValues("channel_selector")[0];
      const messageContent =
        interaction.fields.getTextInputValue("message_input");
      console.log(
        `Twitch Username: ${twitchUsername}, Channel ID: ${channelId}, Message: ${messageContent}`,
      );

      const response = await addSocialMedia(
        "twitch",
        twitchUsername,
        messageContent,
        channelId,
      );
      if (response.success == false) {
        await interaction.reply({
          content: `Failed to save Twitch announcement: ${response.message}`,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      await interaction.reply({
        content: `Twitch announcement saved for: ${twitchUsername} with message: ${messageContent} `,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Erreur lors du traitement du formulaire !",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Erreur lors du traitement du formulaire !",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
}
