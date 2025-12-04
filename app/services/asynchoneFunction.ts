import { ServiceType } from "@/types";
import { Client } from "discord.js";
import { tiktokScrapper } from "@/services";
import { getAllServiceSave } from "@/database";

export async function asyncFunction(bot: Client) {
  const services = await getAllServiceSave();

  if (services == null) {
    console.log("❌ Internal error!");
    return;
  }

  if (services.length < 1) {
    console.log("❌ No services!");
    return;
  }

  services.map(async (service) => {
    switch (service.services_name) {
      case ServiceType.Youtube:
        console.log("Youtube");
        break;
      case ServiceType.Instagram:
        console.log("Instagram");
        break;
      case ServiceType.Twitch:
        console.log("Twitch");
        break;
      case ServiceType.TikTok:
        console.log("Tiktok");
        await tiktokScrapper(bot, service);
        break;
      default:
        console.log("❌ Unmatch type!");
        break;
    }
  });
}
