const Discord = require("discord.js");  
const { GatewayIntentBits, Client, Collection } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});
const config = require("./config.json");
const fs = require('fs')
const events = require('./Handler/events')

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})

client.slashCommands = new Discord.Collection()

require('./Handler/slash')(client)

events.run(client)

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


process.on('unhandledRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n${reason.stack}`);
});

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:]\n\n${error.stack}`);
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n${error.stack}`);
});


client.login(config.token);