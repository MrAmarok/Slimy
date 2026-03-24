import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags
} from "discord.js";
import { SlashCommand } from "@/types";
import { getSocialMediaByPlatform } from "@/database/tables/socialMedia.js";

function delTwitchUser(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("del_twitch_user")
    .setDescription("Delete a Twitch user from the database");

  async function execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const res = await getSocialMediaByPlatform("twitch");
    
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("del_twitch_user_selector")
      .setPlaceholder("Choose Twitch user to delete...")
      .setMaxValues(res.length)
      .addOptions(
        ...res.map(entry => new StringSelectMenuOptionBuilder()
            .setLabel(entry.username)
            .setDescription(`Channel ID: ${entry.channel_id}`)
            .setValue(entry.username)
            .setEmoji("📺")
        )
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.reply({
      components: [row],
      flags: MessageFlags.Ephemeral, 
    });
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default delTwitchUser();