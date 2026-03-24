import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { SlashCommand, TEmbedMessageBuilder, SocialMediaEntry } from "@/types";
import { getSocialMediaByPlatform } from "@/database/tables/socialMedia.js";
import { embedMessageBuilder } from "@/components/embedMessageBuilder.js";

function getTwitchUsers(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("twitch_get_user")
    .setDescription("Get all the twitch user config for the annonce server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async function execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const res = await getSocialMediaByPlatform("twitch");
    const embedMessage = embedMessageBuilder(messageBuilder(res, interaction.client.user.username));
    
    await interaction.reply({
      embeds: [embedMessage],
    });
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default getTwitchUsers();


function messageBuilder(res:  SocialMediaEntry[], username: string): TEmbedMessageBuilder {

  const message: TEmbedMessageBuilder = {
      title: "Twitch Account List",
      description:
        res.length > 0
          ? "Here are the registered Twitch accounts:"
          : "No registered Twitch accounts found.",
      fields: [
        {
          name: "Accounts Twitch",
          value:
            res.length > 0
              ? res.map((entry) => `- **${entry.username}** `).join("\n")
              : "No registered Twitch accounts found.",
            inline: true
        },
        {
          name: "Announcement Channels",
          value:
            res.length > 0
              ? res.map((entry) => `- <#${entry.channel_id}>`).join("\n")
              : "No announcement channels found.",
          inline: true
        },
      ],
      author: {
        name: username,
      },
      color: "#9146FF",
      footer: {
        text: `${username} - Twitch Account List`,
      },
    };
    return message;
}