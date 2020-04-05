import { GameMap } from "./maps";
import { Message, MessageEmbed, User } from "discord.js";

export class InhouseController {
  private commandPrefix: string;

  private mapPool: GameMap[];
  private players: User[];

  constructor(prefix: string) {
    this.commandPrefix = prefix;
    this.resetMapPool();
    this.resetPlayers();
  }

  public handleCommand(msg: Message) {
    const stripped = msg.content.slice(this.commandPrefix.length);

    const [command, ...args] = stripped.split(" ");

    switch (command) {
      case "join":
        this.playerJoin(msg);
        break;
      case "leave":
        this.playerLeave(msg);
        break;
      case "players":
        this.showPlayers(msg);
        break;
      case "pool":
        this.showCurrentPool(msg);
        break;
      case "addmap":
        this.addMap(msg, args);
        break;
      case "rmmap":
        this.rmMap(msg, args);
        break;
      case "rollmap":
        this.rollMap(msg);
        break;
      case "resetpool":
        this.resetMapPool();
        msg.channel.send("Map pool reset.");
        break;
      default:
        this.handleUnknownCommand(msg);
    }
  }

  private playerJoin(msg: Message) {
    const user = msg.author;
    const inList = this.players.find((p) => p.id === user.id);

    if (inList) {
      msg.reply("User already registered.");
    } else {
      this.players.push(user);
      msg.channel.send(`${user} added to player list.`);
    }
  }

  private playerLeave(msg: Message) {
    const user = msg.author;
    this.players = this.players.filter((p) => p.id !== user.id);

    msg.channel.send(`${user} removed from player list.`);
  }

  private showPlayers(msg: Message) {
    const embed = new MessageEmbed();

    embed
      .setTitle("Players:")
      .setColor(0x2cf4bb)
      .addField("Player count:", this.players.length)
      .addField(
        "Players: ",
        this.players.length !== 0
          ? this.players.map((p) => p.username).join("\n")
          : "None"
      );

    msg.channel.send(embed);
  }

  private showCurrentPool(msg: Message) {
    const embed = new MessageEmbed();

    embed
      .setTitle("Currently active map pool")
      .setColor(0x2cf4bb)
      .addField("Map count:", this.mapPool.length)
      .addField("Maps: ", this.mapPool.join("\n"));

    msg.channel.send(embed);
  }

  private addMap(msg: Message, args: string[]) {
    const map = args[0];
    const knownMaps = Object.values(GameMap);

    if (!knownMaps.includes(map as GameMap)) {
      // Not a known map send error message
      const reply = new MessageEmbed();
      reply
        .setTitle("Unknown map")
        .setColor(0xff0000)
        .addField("Available maps: ", knownMaps.join("\n"));
      return msg.channel.send(reply);
    }

    if (this.mapPool.includes(map as GameMap)) {
      // Map is already in the pool
      return msg.channel.send(`Map ${map} is already in the pool.`);
    }

    this.mapPool.push(map as GameMap);
    return msg.channel.send(`Map ${map} added to the pool.`);
  }

  private rmMap(msg: Message, args: string[]) {
    const map = args[0];

    if (!this.mapPool.includes(map as GameMap)) {
      const reply = new MessageEmbed();
      reply
        .setTitle("Map not in pool.")
        .setColor(0xff0000)
        .addField("Current map pool: ", this.mapPool.join("\n"));
      return msg.channel.send(reply);
    }

    this.mapPool = this.mapPool.filter((m) => m !== map);
    msg.channel.send(`Map ${map} removed from pool.`);
  }

  private rollMap(msg: Message) {
    const map = this.mapPool[Math.floor(Math.random() * this.mapPool.length)];

    const reply = new MessageEmbed();
    reply.setTitle("Map rolled.").addField("Chosen map:", map);

    msg.channel.send(reply);
  }

  private resetMapPool() {
    this.mapPool = Object.values(GameMap);
  }

  private resetPlayers() {
    this.players = [];
  }

  private handleUnknownCommand(msg: Message) {
    const embed = new MessageEmbed();

    embed
      .setTitle("Invalid command")
      .setColor(0xff0000)
      .addField("Used command: ", msg.content)
      .addField("Command prefix: ", this.commandPrefix)
      .addField(
        "Available commands: ",
        [
          "join",
          "leave",
          "players",
          "pool",
          "resetpool",
          "addmap",
          "rmmap",
          "rollmap",
        ].join("\n")
      );

    msg.channel.send(embed);
  }
}
