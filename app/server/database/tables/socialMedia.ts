import { query } from "../../index.js";
import { v4 as uuidv4 } from "uuid";
import { SocialMediaEntry } from "../../../types/SQLTable.js";

// SQL pour créer la table social_media
export const socialMedia = `
CREATE TABLE IF NOT EXISTS social_media (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    channel_id VARCHAR(50) NOT NULL,
   
  UNIQUE (platform, username)
);
`;

/**
 * Adds a new social media entry to the database.
 * If an entry with the same platform and username already exists, the operation is ignored.
 *
 * @param platform - The social media platform name (e.g., 'twitter', 'instagram')
 * @param username - The username on the specified platform
 * @param message - The message or content associated with the social media entry
 * @param channelId - The channel identifier to associate with this social media entry
 * @returns A promise that resolves when the operation completes
 */
export async function addSocialMedia(
  platform: string,
  username: string,
  message: string,
  channelId: string,
): Promise<{ success: boolean; message: string }> {
  const uuid = uuidv4();
  const res = await query(
    "INSERT INTO social_media (uuid, platform, username, message, channel_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username, platform) DO NOTHING RETURNING uuid",
    [uuid, platform, username, message, channelId],
  );
  console.log("Add social media result:", res);
  if (!res || res.rowCount === 0)
    return { success: false, message: "Failed to add social media entry, user already exists." };
  return { success: true, message: "Social media entry added successfully." };
}

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

export async function deleteSocialMedia(username: string): Promise<void> {
  await query("DELETE FROM social_media WHERE username = $1", [username]);
}

export async function updateSocialMedia(
  username: string,
  newMessage: string,
): Promise<void> {
  await query("UPDATE social_media SET message = $1 WHERE username = $2", [
    newMessage,
    username,
  ]);
}

export async function updateSocialMediaChannel(
  username: string,
  newChannelId: string,
): Promise<void> {
  await query("UPDATE social_media SET channel_id = $1 WHERE username = $2", [
    newChannelId,
    username,
  ]);
}

export async function updateSocialMediaPlatform(
  username: string,
  newPlatform: string,
): Promise<void> {
  await query("UPDATE social_media SET platform = $1 WHERE username = $2", [
    newPlatform,
    username,
  ]);
}

export async function updateSocialMediaUsername(
  oldUsername: string,
  newUsername: string,
): Promise<void> {
  await query("UPDATE social_media SET username = $1 WHERE username = $2", [
    newUsername,
    oldUsername,
  ]);
}

export async function getSocialMediaByChannelId(
  channelId: string,
): Promise<SocialMediaEntry[]> {
  const res = await query("SELECT * FROM social_media WHERE channel_id = $1", [
    channelId,
  ]);
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
