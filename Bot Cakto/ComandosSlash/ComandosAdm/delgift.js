const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "delgift",
   description: "[🛠|💰 Vendas Moderação] Deleta um Gift",
   type: ApplicationCommandType.ChatInput,
   options: [
      { 
        name: "gift",
        description: "Coloque o gift aqui!",
        type: ApplicationCommandOptionType.String,
        required: true 
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
       
       const gift = interaction.options.getString("gift")
       
       if (!outros.has(gift) || outros.get(`${gift}.tipo`) != `gift`) return interaction.reply({ content: `${emoji.get(`lupa`)} | esse gift não existe`, ephemeral: true })
       
       outros.delete(gift)
       interaction.reply({ content: `${emoji.get(`certo`)} | Gift \`${gift}\` deletado com sucesso!`, ephemeral: true })
   }
}