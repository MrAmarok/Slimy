import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "@/types";
import { insertServer } from "@/database";

export function addServerCommand(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("add_server")
    .setDescription(
      "/addServer to add a server can be executed only by dvaking"
    )
    .addStringOption((option) =>
      option
        .setName("guild_id")
        .setDescription("Id of the server")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("server_name")
        .setDescription("name of the server")
        .setRequired(true)
    );

  async function execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const serverId = interaction.options.getString("guild_id");
    const serverName = interaction.options.getString("server_name");

    console.log(serverId, serverName);

    if (serverId == null || serverName == null) {
      await interaction.reply("Please provide both guild_id and server_name.");
      return;
    }
    if (interaction.user.id != "418692593816436746") {
      await interaction.reply("Ur not Dvaking :eyes:");
      return;
    }

    if (!(await insertServer(serverId, serverName))) {
      await interaction.reply(`❌ ${serverName} register fail`);
      return;
    }

    await interaction.reply(`Hey Dvaking! ${serverName} is register :)`);
  }

  return { data: data as SlashCommandBuilder, execute };
}

export default addServerCommand();
