import * as Discord from "discord.js";
import { InhouseController } from "./inhouse";

export type BotOptions = {
  commandPrefix: string;
};

const defaultOpts = {
  commandPrefix: ".",
};

export class BlobBot {
  private client: Discord.Client;
  private inhouseControl: InhouseController;
  private opts: BotOptions;

  constructor(apiToken: string, opts?: Partial<BotOptions>) {
    this.client = new Discord.Client();
    this.opts = { ...defaultOpts, ...(opts || {}) };
    this.initListeners();

    this.inhouseControl = new InhouseController(this.opts.commandPrefix);

    this.client.login(apiToken);
  }

  private initListeners() {
    if (!this.client) return;

    this.client.on("ready", () => {
      console.log("Bot client ready.");
    });

    this.client.on("message", this.handleMessage.bind(this));
  }

  private isFromBot(msg: Discord.Message) {
    return msg.author.bot;
  }

  private isCommand(msg: Discord.Message) {
    return msg.content.startsWith(this.opts.commandPrefix);
  }

  private handleMessage(msg: Discord.Message) {
    // console.log("Received message object: ", msg);

    // Ignore messages from other bot users
    if (this.isFromBot(msg)) {
      return;
    }

    // This is so ugly I want to die, will fix later :))
    if (msg.channel.type === "dm") {
      const joinLink = `https://discordapp.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&scope=bot&permissions=${process.env.DISCORD_PERMISSION_INT}`;

      msg.channel.send(
        `You can me to your server using this link:\n ${joinLink}`
      );
    }

    if (this.isCommand(msg)) {
      this.inhouseControl.handleCommand(msg);
    }
  }
}
