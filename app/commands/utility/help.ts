import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand, TEmbedMessageBuilder } from "@/types";
import { embedMessageBuilder } from "@/components/embedMessageBuilder.js";

const help = (): SlashCommand => {
  const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Command of Slimy");

  async function execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const embedMessage = embedMessageBuilder(
      messageBuilder(interaction.client.user.username),
    );
    await interaction.reply({
      embeds: [embedMessage],
    });
  }

  return { data, execute };
};

export default help();

function messageBuilder(username: string): TEmbedMessageBuilder {
  const message: TEmbedMessageBuilder = {
    title: "Bot Command List",
    description: `Here are the available commands for ${username}:`,
    fields: [
      {
        name: "Help Command",
        value: "`/help` - Display this help message with the list of commands.",
        inline: false,
      },
      {
        name: "DnD Command",
        value:
          "`/dice [number of faces] [number of dice]` - Roll a dice with the specified number of faces and quantity.\n\
          `/coin` - Flip a coin and get heads or tails.",
        inline: false,
      },
      {
        name: "Admin Commands",
        value: "",
        inline: false,
      },
      {
        name: "Social Media Commands",
        value:
          "`/socialmedia_selector` - Select a social media platform to configure.",
        inline: false,
      },
      {
        name: "Twitch User Commands",
        value:
          "`/twitch_get_user` - Get all the Twitch user configurations for the announcement server.\n\
          `/twitch_delete_user` - Delete a Twitch user configuration from the announcement server.\n\
          `/twitch_update_user` - Update a Twitch user configuration in the announcement server.\n",
        inline: false,
      },
    ],
    color: "#54e600",
    footer: {
      text: `${username} - Your friendly Twitch bot!`,
    },
  };
  return message;
}
