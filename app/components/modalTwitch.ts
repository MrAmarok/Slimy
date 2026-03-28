import {
  ChannelSelectMenuBuilder, // <-- Nouvel import
  ChannelType,
  Client,
  LabelBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

// Tu n'as plus besoin d'importer getChannelsWhereICanWrite ici
// car Discord s'occupe d'afficher tous les salons nativement.

export async function modalTwitch(
  selectedStyle: string,
  username?: string,
) {
  let modal: ModalBuilder;
  let usernameLabel: LabelBuilder;

  if (!username) {
    modal = new ModalBuilder()
      .setCustomId(`modal_${selectedStyle}`)
      .setTitle("Twitch Announcement Configuration");

    const usernameInput = new TextInputBuilder()
      .setCustomId("username_input")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`Enter your ${selectedStyle} username`);

    usernameLabel = new LabelBuilder()
      .setLabel(`What's your ${selectedStyle} username?`)
      .setDescription(
        "Enter your username for the selected social media platform.",
      )
      .setTextInputComponent(usernameInput);
  } else {
    modal = new ModalBuilder()
      .setCustomId(`modal_update_${selectedStyle}_${username}`)
      .setTitle("Twitch Announcement Configuration");

    const usernameInput = new TextInputBuilder()
      .setCustomId("username_input")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`Enter your ${selectedStyle} username`)
      .setValue(username);

    usernameLabel = new LabelBuilder()
      .setLabel(`Update ${username.slice(0, 15)} on ${selectedStyle}`)
      .setDescription(
        "Enter your username for the selected social media platform.",
      )
      .setTextInputComponent(usernameInput);
  }

  const channelSelector = new ChannelSelectMenuBuilder()
    .setCustomId("channel_selector")
    .setPlaceholder("Select a channel to post the announcement")
    .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement);

  const channelLabel = new LabelBuilder()
    .setLabel(`Where to post announcement?`)
    .setDescription(
      "Select the channel where you want to post the announcement.",
    )
    .setChannelSelectMenuComponent(channelSelector); 


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