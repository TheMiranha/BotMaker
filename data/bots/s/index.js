const Discord = require('discord.js');
const fs = require('fs');

const intents = new Discord.Intents();
intents.add(Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Discord.Client({intents});
client.commands = new Discord.Collection();

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", async(err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      var args = props.content != undefined ? props.content.split(' ').slice(1) : undefined;
      client.commands.set(commandName, props, args);
    });
  });

  fs.readdir('./apis/', async(err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file.indexOf('.js') > -1)
      {
        const api = require(`./apis/${file}`);
        api.inject(client);
      }
    });
  })


  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    const config = JSON.parse(data);
    client.config = config;
    client.login(config.token);
  })