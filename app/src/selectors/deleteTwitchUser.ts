import { deleteSocialMedia } from "@/database";
import { MessageFlags, StringSelectMenuInteraction } from "discord.js";

export async function deleteTwitchUser(
  interaction: StringSelectMenuInteraction,
) {
  try {
    const selectedUser = interaction.values;

    selectedUser.map(async (username) => {
      const res = await deleteSocialMedia(username);
      if (!res) {
        console.warn(`\n❌ Failed to delete Twitch user: ${username}`);
        return;
      }
      console.log(`\n✅  Deleted Twitch user: ${username}`);
    });

    await interaction.reply({
      content: `✅ Twitch users deleted: ${selectedUser.join(", ")}`,
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
