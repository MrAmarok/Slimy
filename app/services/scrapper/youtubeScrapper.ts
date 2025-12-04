import { GetUserOfSM } from "@/types";
import { Client } from "discord.js";

// curl ""
// curl "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UPLOADS_PLAYLIST_ID&maxResults=1&key=VOTRE_CLE_API"
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const latestVideo = data.items[0];
    if (latestVideo) {
      const videoId = latestVideo.id.videoId;
      console.log(`ID de la dernière vidéo : ${videoId}`);
    }
  })
  .catch((error) => console.error("Erreur de l’API YouTube:", error));

export async function youtubeScrapper(bot: Client, socialMedia: GetUserOfSM) {
  // First call to get the playlist
  const urlPlaylist = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${socialMedia.username}&key=${process.env.GOOGLE_API_KEY}`;
}
