const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, ComponentType } = require("discord.js")
const { perms, General, emoji, saldo } = require("../../DataBaseJson")

module.exports = {
   name: "cleardm",
   description: "[🛠️ | Utilidades] Limpe todas as mensagem do bot na sua DM!",
   run: async(client, interaction) => {
       await interaction.reply(`${emoji.get(`certo`)} **| ${interaction.user} Ok, irei limpar sua dm!**`)
       let quantidadeApagada = 0
       const dm = await interaction.member.createDM()
       const deleteMessage = await client.channels.cache.get(dm.id).messages.fetch({ limit: 100 })
       await deleteMessage.map((msg) => {
          if (msg.author.bot) {
             quantidadeApagada += 1
             msg.delete()
          }
       })
      
      if (quantidadeApagada == 0) {
         await interaction.editReply(`${emoji.get(`emojix`)} | Nenhuma mensagem encontrada!`)
         return
      }
      
      await interaction.editReply(`${emoji.get(`certo`)} | Total de mensagens apagadas: ${quantidadeApagada}`)
   }
}