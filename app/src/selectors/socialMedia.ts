import { modalTwitch } from "@/components";
import { MessageFlags, StringSelectMenuInteraction } from "discord.js";

export async function socialMedia(
  interaction: StringSelectMenuInteraction,
) {
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
