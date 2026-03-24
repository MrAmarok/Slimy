import { createTables, socialMedia } from "./index.js";

export async function initTables(): Promise<void> {
  console.log("Start init tables");

  try {
    await createTables(socialMedia);
    console.log("Tables social_media created!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}
