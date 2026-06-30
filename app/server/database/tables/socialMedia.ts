import { query } from "@/server";
import { v4 as uuidv4 } from "uuid";
import { CreateSocialMediaEntry, SocialMediaEntry } from "@/types/SQLTable.js";

export async function addSocialMedia(
  { platform, username, message, channel_id }: CreateSocialMediaEntry
): Promise<{ success: boolean; message: string }> {
  const uuid = uuidv4();
  const res = await query(
    "INSERT INTO social_media (uuid, platform, username, message, channel_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username, platform) DO NOTHING RETURNING uuid",
    [uuid, platform, username, message, channel_id],
  );
  if (!res || res.rowCount === 0)
    return {
      success: false,
      message: "\n❌ Failed to add social media entry, user already exists.",
    };
  return { success: true, message: "Social media entry added successfully." };
}

// GET functions
export async function getSocialMedia(
  username: string,
): Promise<SocialMediaEntry | undefined> {
  const res = await query("SELECT * FROM social_media WHERE username = $1", [
    username,
  ]);
  return res.rows[0] as SocialMediaEntry | undefined;
}

export async function getAllSocialMedia(): Promise<SocialMediaEntry[]> {
  const res = await query("SELECT * FROM social_media");
  return res.rows as SocialMediaEntry[];
}

export async function getSocialMediaByPlatform(
  platform: string,
): Promise<SocialMediaEntry[]> {
  const res = await query("SELECT * FROM social_media WHERE platform = $1", [
    platform,
  ]);
  return res.rows as SocialMediaEntry[];
}

export async function getSocialMediaByUsername(
  username: string,
): Promise<SocialMediaEntry[]> {
  const res = await query("SELECT * FROM social_media WHERE username = $1", [
    username,
  ]);
  return res.rows as SocialMediaEntry[];
}

export async function getSocialMediaByPlatformAndUsername(
  platform: string,
  username: string,
): Promise<SocialMediaEntry | undefined> {
  const res = await query(
    "SELECT * FROM social_media WHERE platform = $1 AND username = $2",
    [platform, username],
  );
  return res.rows[0] as SocialMediaEntry | undefined;
}


export async function getSocialMediaByChannelId(
  channelId: string,
): Promise<SocialMediaEntry[]> {
  const res = await query("SELECT * FROM social_media WHERE channel_id = $1", [
    channelId,
  ]);
  return res.rows as SocialMediaEntry[];
}

// UPDATE functions
export async function updateSocialMediaMessage(
  username: string,
  newMessage: string,
): Promise<boolean> {
  const res = await query("UPDATE social_media SET message = $1 WHERE username = $2", [
    newMessage,
    username,
  ]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update message for username: ${username}`);
    return false;
  }
  return true;
}

export async function updateSocialMediaMessageSend(
  username: string,
  messageSended: boolean,
): Promise<boolean> {
  const res = await query("UPDATE social_media SET message_sended = $1 WHERE username = $2", [
    messageSended,
    username,
  ]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update message_sended for username: ${username}`);
    return false;
  }
  return true;
}

export async function updateSocialMediaChannel(
  username: string,
  newChannelId: string,
): Promise<boolean> {
  const res = await query("UPDATE social_media SET channel_id = $1 WHERE username = $2", [
    newChannelId,
    username,
  ]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update channel_id for username: ${username}`);
    return false;
  }
  return true;
}

export async function updateSocialMediaPlatform(
  username: string,
  newPlatform: string,
): Promise<boolean> {
  const res = await query("UPDATE social_media SET platform = $1 WHERE username = $2", [
    newPlatform,
    username,
  ]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update platform for username: ${username}`);
    return false;
  }
  return true;
}

export async function updateSocialMediaUsername(
  oldUsername: string,
  newUsername: string,
): Promise<boolean> {
  const res = await query("UPDATE social_media SET username = $1 WHERE username = $2", [
    newUsername,
    oldUsername,
  ]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update username for username: ${oldUsername}`);
    return false;
  }
  return true;
}

export async function updateAllSocialMediaInformation(
  oldUsername: string,
  newData: Omit<SocialMediaEntry, "uuid" | "message_sended" | "platform">,
): Promise<boolean> {
  const res = await query(
    "UPDATE social_media SET username = $1, message = $2, channel_id = $3 WHERE username = $4",
    [
      newData.username,
      newData.message,
      newData.channel_id,
      oldUsername,
    ],
  );
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to update all information for username: ${oldUsername}`);
    return false;
  }
  return true;
}

// DELETE functions
export async function deleteSocialMedia(username: string): Promise<boolean> {
  const res = await query("DELETE FROM social_media WHERE username = $1", [username]);
  if (!res || res.rowCount === 0) {
    console.warn(`\n❌ Failed to delete social media entry for username: ${username}`);
    return false;
  }
  return true;
}
