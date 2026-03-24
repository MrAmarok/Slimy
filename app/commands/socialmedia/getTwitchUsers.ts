import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "@/types";
import { getSocialMediaByPlatform } from "@/database/tables/socialMedia.js";

function getTwitchUsers(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("annonce_get_user_twitch")
    .setDescription("Get all the twitch user config for the annonce server");

  async function execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const res = await getSocialMediaByPlatform("twitch");

    await interaction.reply({
      content: res.length > 0 
        ? `Voici les utilisateurs Twitch enregistrés:\n${res.map(entry => `- ${entry.username} (Channel ID: ${entry.channel_id})`).join("\n")}`
        : "Aucun utilisateur Twitch trouvé.", 
    });
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default getTwitchUsers();