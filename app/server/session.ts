import { UserSession } from "@/types";

let userSessions: UserSession;

export async function getTwitchToken() {
  console.log("🔑 Fetching Twitch token...");
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Twitch credentials: set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in environment.",
    );
  }

  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }).toString(),
  });

  if (!response.ok)
    throw new Error(`Failed to get Twitch token: ${response.statusText}`);
  else 
    console.log("✅ Twitch token fetched successfully!");
  const data = await response.json();
  return data.access_token;
}

export async function getUserSessions(userSessions: UserSession) {
  console.log("\n🔑 Initializing user sessions...");
  const token = await getTwitchToken();

  userSessions.twitchToken = token;
  console.log("✅ User sessions initialized");
}
