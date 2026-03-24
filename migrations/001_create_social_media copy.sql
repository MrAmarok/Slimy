CREATE TABLE IF NOT EXISTS social_media (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  channel_id VARCHAR(50) NOT NULL,
  message_sended BOOLEAN DEFAULT FALSE,
  UNIQUE (platform, username)
);