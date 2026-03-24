// Définition du type SocialMediaEntry
type TSocialMediaEntry = {
  uuid: string;
  platform: string;
  username: string;
  message: string;
  channel_id: string;
  message_sended: boolean;
};

export type CreateSocialMediaEntry = Omit<TSocialMediaEntry, "uuid" | "message_sended">;
export type SocialMediaEntry = TSocialMediaEntry;
