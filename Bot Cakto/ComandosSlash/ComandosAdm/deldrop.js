const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "deldrop",
   description: "[🛠|💰 Vendas Moderação] Delete uma Drop",
   type: ApplicationCommandType.ChatInput,
   options: [
      { 
        name: "drop",
        description: "Coloque o drop aqui!",
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
       
       const key = interaction.options.getString("drop")
       
       if (!outros.has(key) || outros.get(`${key}.tipo`) != `drop`) return interaction.reply({ content: `${emoji.get(`lupa`)} | esse drop não existe`, ephemeral: true })
       
       outros.delete(key)
       interaction.reply({ content: `${emoji.get(`certo`)} | Drop \`${key}\` deletado com sucesso!`, ephemeral: true })
   }
}