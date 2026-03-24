import "dotenv/config";

import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  MessageFlags,
  User,
} from "discord.js";

import { SlashCommand, UserSession } from "@/types";
import {
  loadCommands,
  getDirname,
  chatInputInteraction,
  stringSelectMenuInteraction,
  modalSubmitInteraction,
} from "@/utils";
import { deployCommand } from "./deployCommands.js";
import { getUserSessions, connectDatabase } from "@/server";
import { twitchCallLoop } from "./utils/loop.js";

let userSessions: UserSession = {
  twitchToken: "",
  twitchClientId: process.env.TWITCH_CLIENT_ID || "",
};

await connectDatabase();
await getUserSessions(userSessions);
// setInterval(() => twitchCallLoop(userSessions), 10000);

deployCommand();

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

bot.once(Events.ClientReady, (readyClient) => {
  console.log(`\n🤖 Ready! Logged in as ${readyClient.user.tag}`);
});

bot.commands = new Collection();

const __dirname = getDirname(import.meta.url);

// Charge toutes les commandes en utilisant l'utilitaire centralisé
const loadedCommands: SlashCommand[] = await loadCommands(__dirname);

// Ajoute chaque commande à la collection du bot
for (const command of loadedCommands) {
  bot.commands.set(command.data.name, command);
}

bot.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await chatInputInteraction(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await stringSelectMenuInteraction(interaction);
  } else if (interaction.isModalSubmit()) {
    await modalSubmitInteraction(interaction);
  }
});

bot.login(process.env.DEVTOKEN);
