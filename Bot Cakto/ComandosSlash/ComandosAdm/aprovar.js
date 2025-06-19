const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema, rankproduto, carrinhos, rank, cupons, rendimentos, saldo } = require("../../DataBaseJson")

module.exports = {
   name: "aprovar",
   description: "[🛠|💰 Vendas Moderação] Altere o status de uma compra para aprovado",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "id",
       description: "Coloque o ID da compra Aqui!",
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
       
       const id = interaction.options.getString("id")
       
       if (!carrinhos.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Id não encontrado`, ephemeral: true })
       
       if (carrinhos.get(`${id}.status`) == 'aprovado' || carrinhos.get(`${id}.status`) == 'Entregue') return interaction.reply({ content: `${emoji.get(`emojix`)} | Não é possível mais aprovar essa compra!`, ephemeral: true })
       
       carrinhos.set(`${id}.status`, `aprovado`)
       interaction.reply({ content: `${emoji.get(`certo`)} | Status alterado para pago!`, ephemeral: true })
   }
}