import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import "dotenv/config";
import { loadCommands, getDirname } from "@/utils";

const token = process.env.DEVTOKEN || process.env.TOKEN;
const appId = process.env.DEVAPPID || process.env.APPID;
const guildId = process.env.GUILDID;

if (!token) {
  console.error(`❌ No TOKEN found in environment variables.`);
  process.exit(1);
}

if (!appId) {
  console.error(`❌ No APPID found in environment variables.`);
  process.exit(1);
}

if (!guildId) {
  console.error(`❌ No GUILDID found in environment variables.`);
  process.exit(1);
}

export async function deployCommand(): Promise<void> {
  const __dirname = getDirname(import.meta.url);
  const loadedCommands = await loadCommands(__dirname);

  const commands: RESTPostAPIApplicationCommandsJSONBody[] = loadedCommands.map(
    (command) => command.data.toJSON(),
  );

  const rest = new REST({ version: "10" }).setToken(token!);

  try {
    console.log(
      `\n🚀 Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = (await rest.put(
      Routes.applicationGuildCommands(
        appId!,
        guildId!,
      ),
      { body: commands },
    )) as RESTPostAPIApplicationCommandsJSONBody[];

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error("❌ Error while deploying commands:", error);
  }
}
