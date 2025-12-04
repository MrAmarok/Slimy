import { client } from "./int.js";

export async function insertServer(serverId: string, serverName: string) {
  try {
    await client.server.create({
      data: {
        id: serverId,
        name: serverName,
      },
    });
    return true;
  } catch (err) {
    console.error("❌ Error where server is add :", err);
    return false;
  }
}

export async function findServerInformation(serverId: string) {
  try {
    const server = await client.server.findUnique({
      where: { id: serverId },
    });
    return server;
  } catch (err) {
    console.error("❌ No server found :", err);
    return null;
  }
}

export async function getAllServerId() {
  try {
    const server = await client.server.findMany({
      select: { id: true, name: true },
    });
    return server;
  } catch (err) {
    console.error("❌ Internal Error:", err);
    return null;
  }
}

export async function updateServerName(serverId: string, newName: string) {
  try {
    await client.server.update({
      where: { id: serverId },
      data: { name: newName },
    });
    return `✅ ${newName} is successfuly change`;
  } catch (err) {
    console.error("❌ No server found :", err);
    return "❌ No server found";
  }
}

export async function deleteServer(serverId: string) {
  try {
    await client.server.delete({
      where: { id: serverId },
    });
    return `✅ Server deleted`;
  } catch (err) {
    console.error("❌ No server found :", err);
    return "❌ No server found";
  }
}
