const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "delkey",
   description: "[🛠|💰 Vendas Moderação] Deleta uma Key",
   type: ApplicationCommandType.ChatInput,
   options: [
      { 
        name: "key",
        description: "Coloque a key aqui!",
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
       
       const key = interaction.options.getString("key")
       
       if (!outros.has(key) || outros.get(`${key}.tipo`) != `key`) return interaction.reply({ content: `${emoji.get(`lupa`)} | essa key não existe`, ephemeral: true })
       
       outros.delete(key)
       interaction.reply({ content: `${emoji.get(`certo`)} | Key \`${key}\` deletada com sucesso!`, ephemeral: true })
   }
}