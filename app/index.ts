import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  MessageFlags,
} from "discord.js";

import { SlashCommand } from "@/types";
import { loadCommands, getDirname } from "@/utils";

import { deployCommand } from "./deployCommands.js";

import "dotenv/config";
import { handleModalSubmit, modalSocialMedia } from "@/components";
import { asyncFunction } from "@/services";

deployCommand();

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

bot.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);

  setInterval(async () => {
    try {
      console.log("🔄 Tâche périodique lancée");
      await asyncFunction(readyClient);
    } catch (err) {
      console.error("❌ Erreur dans la tâche périodique :", err);
    }
  }, 1 * 1000);
});

bot.commands = new Collection();

const __dirname = getDirname(import.meta.url);

// Charge toutes les commandes en utilisant l'utilitaire centralisé
const loadedCommands: SlashCommand[] = await loadCommands(__dirname);

// Ajoute chaque commande à la collection du bot
for (const command of loadedCommands) {
  bot.commands.set(command.data.name, command);
}

bot.on(Events.InteractionCreate, async (int) => {
  if (int.isModalSubmit()) {
    if (int.customId.startsWith("modal_watcher_")) {
      const parts = int.customId.split("_");
      await handleModalSubmit(int, parts[2], parts[3]);
    }
    return;
  }
  if (int.isStringSelectMenu()) {
    if (int.customId.startsWith("select_social_")) {
      const parts = int.customId.split("_");
      await modalSocialMedia(int, int.values[0], parts[2]);
    }
  }

  if (!int.isChatInputCommand()) return;

  const command = int.client.commands.get(int.commandName);
  if (!command) {
    console.error(`❌ No command matching ${int.commandName} was found.`);
    return;
  }

  try {
    await command.execute(int);
  } catch (error) {
    console.error(error);
    if (int.replied || int.deferred) {
      await int.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await int.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

bot.login(process.env.DEVTOKEN);
