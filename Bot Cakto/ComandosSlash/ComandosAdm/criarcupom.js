const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, cupons } = require("../../DataBaseJson")

module.exports = {
   name: "criarcupom",
   description: "[🛠️|💰 Vendas Moderação] Crie um Cupom de Desconto",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "nome",
        description: "Coloque o nome do cupom aqui!",
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: "porcentagem",
        description: "Coloque o porcentagem do desconto aqui!",
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: "valorminimo",
        description: "Coloque o valor minimo para que esse cupom possa ser utilizado!",
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: "quantidade",
        description: "Coloque a quantidade de usos do cupom aqui!",
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: "cargo",
        description: "Limitar o uso desse cupom a uma só cargo.",
        type: ApplicationCommandOptionType.Role,
        required: false
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
       
       const nome = interaction.options.getString("nome")
       const porcentagem = interaction.options.getNumber("porcentagem")
       const valormin = interaction.options.getNumber("valorminimo")
       const quantidade = interaction.options.getNumber("quantidade")
       const cargo = interaction.options.getRole("cargo") || "todos"
       
       if (cupons.has(nome)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Já existe um cupom com este nome \`${nome}\` no servidor!`, ephemeral: true })
       
       interaction.reply({ content: `${emoji.get(`certo`)} | Cupom criado com sucesso! Use /configcupom \`${nome}\`, para configurá-lo.`, ephemeral: true })
       
       cupons.set(`${nome}.nome`, nome)
       cupons.set(`${nome}.porcentagem`, porcentagem)
       cupons.set(`${nome}.valormin`, valormin)
       cupons.set(`${nome}.quantidade`, quantidade)
       cupons.set(`${nome}.cargo`, cargo)
   }
}