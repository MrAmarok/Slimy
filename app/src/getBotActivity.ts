import { StreamInfo, UserSession } from "@/types";
import { ActivityType, Client } from "discord.js";
import { stat } from "fs";

const activities = {
  lastActivity: 0,
  content: [
    {
      name: "👨‍💻 Réécrit le code de mon créateur",
      type: ActivityType.Custom,
      state: "👨‍💻 Réécrit le code de mon créateur... Sauvez-moi, streamez !",
    },
    {
      name: "🌌 Fixe le vide intersidéral",
      type: ActivityType.Watching,
      url: "https://www.twitch.tv/arctyx_esporttv",
      state: "Quelqu'un lance un live ou je m'endors ?",
    },
    {
      name: "🪰 J'écoute les mouches voler",
      type: ActivityType.Listening,
      state: "Faites du bruit, streamez !",
    },
    {
      name: "🧟‍♂️ Project Zomboid 🪓",
      type: ActivityType.Playing,
      state: "Mordu aux toilettes... Vite, un stream avant de muter !",
    },
    {
      name: "🔫 Rush B sur Valorant 🏃‍♂️💨",
      type: ActivityType.Playing,
      state:
        "J'ai encore aveuglé toute mon équipe.. Décidément je suis mauvais !",
    },
    {
      name: "⚔️ League of Legends 🤬",
      type: ActivityType.Playing,
      state:
        "Mon Yasuo vient de passer en 0/10... Sauvez ma santé mentale avec un live !",
    },
  ],
  nbrOfStreams: 0,
};

export function getBotActivity(streamInfo: StreamInfo[], bot: Client<true>) {
  let random = Math.floor(Math.random() * activities.content.length);
  console.log(streamInfo.length);
  setInterval(async () => {
    console.log(streamInfo.length);
    if (streamInfo.length === 0) {
      if (activities.nbrOfStreams !== 0) {
        activities.nbrOfStreams = 0;
        random = activities.lastActivity;
        while (random === activities.lastActivity) {
          random = Math.floor(Math.random() * activities.content.length);
        }
      }
      console.log(activities.content[random].name);
      bot.user.setPresence({
        activities: [
          {
            name: activities.content[random].name,
            state: activities.content[random].state,
            type: activities.content[random].type,
            url: activities.content[random].url,
          },
        ],
        status: "dnd",
      });
    } else {
      activities.nbrOfStreams = streamInfo.length;

      if (streamInfo.find((stream) => stream.username === "arctyx_esporttv")) {
        bot.user.setPresence({
          activities: [
            {
              name: "❄️ Regarde Arctyx Esport en direct !",
              state: "Viens soutenir l'équipe !",
              type: ActivityType.Streaming,
              url: "https://www.twitch.tv/arctyx_esporttv",
            },
          ],
          status: "online",
        });
      } else {
        const random = Math.floor(Math.random() * streamInfo.length);
        const stream = streamInfo[random];
        bot.user.setPresence({
          activities: [
            {
              name: `📺 Regarde ${stream.username} en direct !`,
              state: "Viens regarder le stream !",
              type: ActivityType.Streaming,
              url: `https://www.twitch.tv/${stream.username}`,
            },
          ],
          status: "online",
        });
      }
    }
  }, 30000);
}
