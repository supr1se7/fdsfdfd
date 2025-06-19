const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
   name: "del",
   description: "[🛠|💰 Vendas Moderação] Delete o produto que você colocou o ID",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Coloque o ID do produto aqui!",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true
      }
   ],
   
   run: async(client, interaction) => {
       if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
       const id = interaction.options.getString("id")
       
       if (!produto.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | esse produto não existe`, ephemeral: true })
       
       const canal = await interaction.guild.channels.cache.get(produto.get(`${id}.idcanal`))
       
       const message = await canal.messages.fetch(produto.get(`${id}.idmsg`))
       
       produto.delete(id)
       interaction.reply({ content: `${emoji.get(`certo`)} | Produto \`${id}\` deletado com sucesso!`, ephemeral: true })
       
       try {
         await message.delete()
       } catch (error) {
         if (error.code == 10080) {
           return 
         }
       }
   }
}