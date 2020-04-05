import { config as envConfig } from "dotenv";
envConfig();

import { BlobBot } from "./discord/bot";

let bot: BlobBot;

const init = async () => {
  console.log("Starting process.");

  console.log("Starting Discord bot client");
  bot = new BlobBot(process.env.DISCORD_BOT_TOKEN);
};

init();
