const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji } = require("../../DataBaseJson")

module.exports = {
   name: "setdono",
   description: "[🛠️ Developer Only]",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "user",
       description: "User",
       type: ApplicationCommandOptionType.User,
       required: true
     }
   ],
   
   run: async(client, interaction) => {
       const user = interaction.options.getUser("user")
       
       if (General.get('creator') != "") {
         if (interaction.user.id != General.get('creator')) return interaction.reply({ content: `${emoji.get(`emojix`)} | Apenas o dono pode utilizar esse comando!`, ephemeral: true })
         
         General.set(`creator`, user.id)
         interaction.reply({ content: `${emoji.get(`certo`)} | Você setou ${user} de dono do BOT.`, ephemeral: true })
       }
       
       General.set(`creator`, user.id)
       perms.set(user.id, user.id)
       interaction.reply({ content: `${emoji.get(`certo`)} | Você setou ${user} de dono do BOT.`, ephemeral: true })
   }
}