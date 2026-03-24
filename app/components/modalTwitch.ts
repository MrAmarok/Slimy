import {
  ChannelType,
  Client,
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { getGuildChannels } from "@/utils";

export async function modalTwitch(
  selectedStyle: string,
  client: Client,
  guildId: string,
) {
  const channels = await getGuildChannels(client, guildId);
  if (!channels) {
    throw new Error("Unable to fetch channels for the guild.");
  }

  const modal = new ModalBuilder()
    .setCustomId(`modal_${selectedStyle}`)
    .setTitle("Forms Example");

  const usernameInput = new TextInputBuilder()
    .setCustomId("username_input")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`Enter your ${selectedStyle} username`);

  const usernameLabel = new LabelBuilder()
    .setLabel(`What's your ${selectedStyle} username?`)
    .setDescription(
      "Enter your username for the selected social media platform.",
    )
    .setTextInputComponent(usernameInput);

  console.log("channels:", channels);
  const channelSelector = new StringSelectMenuBuilder()
    .setCustomId("channel_selector")
    .setPlaceholder("Select a channel to post the announcement")
    .addOptions(
      channels.map((channel) => ({
        label: channel.name,
        value: channel.id,
      })),
    );

  const channelLabel = new LabelBuilder()
    .setLabel(`Where to post announcement?`)
    .setDescription(
      "Select the channel where you want to post the announcement.",
    )
    .setStringSelectMenuComponent(channelSelector);

  const messageInput = new TextInputBuilder()
    .setCustomId("message_input")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(`Enter your ${selectedStyle} message`);

  const messageLabel = new LabelBuilder()
    .setLabel(`What's your ${selectedStyle} annonce message?`)
    .setDescription("Enter your message displayed on the announcement.")
    .setTextInputComponent(messageInput);
  
  modal.addLabelComponents(usernameLabel, channelLabel, messageLabel);
  return modal;
}
