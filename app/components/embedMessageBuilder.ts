import { EmbedAuthorData, EmbedBuilder, EmbedField, EmbedFooterOptions } from "discord.js";

interface EmbedMessageBuilderProps {
    title: string;
    description: string;
    fields?: EmbedField[];
    color?: string;
    author?: EmbedAuthorData;
    url?: string;
    imageUrl?: string;
    footer?: EmbedFooterOptions;
}

export function embedMessageBuilder({
  title,
    description,
    fields = [],
    color = "#15b625",
    author,
    url,
    footer
}: EmbedMessageBuilderProps): EmbedBuilder {

  return new EmbedBuilder()
    .setColor(color ? parseInt(color.replace("#", ""), 16) : parseInt("15b625", 16))
    .setAuthor(author ? author : null)
    .setTitle(title)
    .setURL(url ? url : null)
    .setDescription(description)
    .addFields(...fields)
    .setFooter(footer ? footer : null);
}
