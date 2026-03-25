import { ActivityType, EmbedAuthorData, EmbedField, EmbedFooterOptions } from "discord.js";

export type UserSession = {
  twitchToken: string;
  twitchClientId: string;
};

export type Activity = {
  name: string;
  type: ActivityType;
};

export type StreamInfo = {
  username: string;
  link: string;
  title: string;
}

export type TEmbedMessageBuilder = {
    title: string;
    description: string;
    fields?: EmbedField[];
    color?: string;
    author?: EmbedAuthorData;
    url?: string;
    imageUrl?: string;
    footer?: EmbedFooterOptions;
}