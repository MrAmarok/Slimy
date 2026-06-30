import { modalTwitch } from "@/components";
import { MessageFlags, StringSelectMenuInteraction } from "discord.js";

export async function updateTwitch(
  interaction: StringSelectMenuInteraction,
) {
  try {
    const selectedUsername = interaction.values[0];
    const modal = await modalTwitch(
      "twitch",
      selectedUsername
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
