import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import "dotenv/config";
import { loadCommands, getDirname } from "@/utils";

export async function deployCommand(): Promise<void> {
  const __dirname = getDirname(import.meta.url);
  const loadedCommands = await loadCommands(__dirname);

  // Convertit les commandes en format JSON pour le déploiement
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = loadedCommands.map(
    (command) => command.data.toJSON()
  );

  // Construct and prepare an instance of the REST module
  if (!process.env.DEVTOKEN) {
    console.error(`❌ No TOKEN found in environment variables.`);
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DEVTOKEN);

  // Déploiement des commandes
  try {
    console.log(
      `\n🚀 Started refreshing ${commands.length} application (/) commands.`
    );

    if (!process.env.DEVAPPID) {
      console.error("❌ No DEVAPPID found in environment variables.");
      return;
    }
    if (!process.env.GUILDID) {
      console.error("❌ No GUILDID found in environment variables.");
      return;
    }

    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.DEVAPPID,
        process.env.GUILDID
      ),
      { body: commands }
    )) as RESTPostAPIApplicationCommandsJSONBody[];

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error("❌ Error while deploying commands:", error);
  }
}
