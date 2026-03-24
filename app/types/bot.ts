import { EmbedAuthorData, EmbedField, EmbedFooterOptions } from "discord.js";

export type UserSession = {
  twitchToken: string;
  twitchClientId: string;
};


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