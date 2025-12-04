import { SocialMInsert } from "@/types";
import { client } from "./int.js";

export async function insertSocialMedia({
  server_id,
  services_name,
}: SocialMInsert) {
  try {
    const table = await client.socialMedia.create({
      data: {
        services_name,
        username: "",
        server: { connect: { id: server_id } },
      },
    });
    return table.uuid;
  } catch (err) {
    console.error("❌ Error where server is add :", err);
    return null;
  }
}

export async function getAllServiceSave() {
  try {
    const server = await client.socialMedia.findMany({
      select: {
        services_name: true,
        server_id: true,
        username: true,
      },
    });
    return server;
  } catch (err) {
    console.error("❌ Internal Error:", err);
    return null;
  }
}

// export async function findServerInformation(serverId: string) {
//   try {
//     const server = await client.server.findUnique({
//       where: { id: serverId },
//     });
//     return server;
//   } catch (err) {
//     console.error("❌ No server found :", err);
//     return null;
//   }
// }

// export async function updateServerName(serverId: string, newName: string) {
//   try {
//     await client.server.update({
//       where: { id: serverId },
//       data: { name: newName },
//     });
//     return `✅ ${newName} is successfuly change`;
//   } catch (err) {
//     console.error("❌ No server found :", err);
//     return "❌ No server found";
//   }
// }

// export async function deleteServer(serverId: string) {
//   try {
//     await client.server.delete({
//       where: { id: serverId },
//     });
//     return `✅ Server deleted`;
//   } catch (err) {
//     console.error("❌ No server found :", err);
//     return "❌ No server found";
//   }
// }

//-------------------------------
//           YOUTUBE
//-------------------------------


export async function insertYoutubeScrapper() {
  try {
    const table = await client.youtubeScrapper.create({
      data: {
        user_id,
        channel_id,
        socialMedia_uuid,
        
      }
    })
    return table.uuid;
  } catch (err) {
    console.error("❌ Error where server is add :", err);
    return null;
  }
}