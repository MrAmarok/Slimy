import {
  ActionRowBuilder,
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
} from "discord.js";

import { SocialMWInsert } from "@/types";
import { insertSocialMediaWatcher } from "@/database";

export async function modalSocialMedia(
  int: StringSelectMenuInteraction,
  selectedSocial: string,
  channel_id: string
) {
  const modal = new ModalBuilder()
    .setCustomId(`modal_watcher_${selectedSocial}_${channel_id}_${int.user.id}`)
    .setTitle(`Add a watcher for ${selectedSocial}`);

  const usernameInput = new TextInputBuilder()
    .setCustomId("username")
    .setLabel(`Username for ${selectedSocial}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const messageInput = new TextInputBuilder()
    .setCustomId("message")
    .setLabel("Message to send")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    usernameInput
  );
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
    messageInput
  );

  modal.addComponents(row1, row2);

  await int.showModal(modal);
}

export async function handleModalSubmit(
  interaction: ModalSubmitInteraction,
  serviceName: string,
  channelId: string
) {
  const username = interaction.fields.getTextInputValue("username");
  const message = interaction.fields.getTextInputValue("message");

  const service: SocialMWInsert = {
    server_id: `${interaction.guildId}`,
    channel_id: channelId,
    message,
    services_name: serviceName,
    username,
    last_video: null,
  };

  if ((await insertSocialMediaWatcher(service)) == null)
    await interaction.reply(`❌ ${serviceName} watcher failed!`);

  await interaction.reply(
    `✅ ${serviceName} watcher configured for @${username} in ${channelId}.`
  );
}
