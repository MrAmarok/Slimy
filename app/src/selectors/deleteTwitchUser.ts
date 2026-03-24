import { deleteSocialMedia } from "@/database";
import { MessageFlags, StringSelectMenuInteraction } from "discord.js";

export async function deleteTwitchUser(
  interaction: StringSelectMenuInteraction,
) {
  try {
    const selectedUser = interaction.values;
    console.log(`Selected Twitch users to delete: ${selectedUser.join(", ")}`);

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
