const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder } = require("discord.js")
const { perms, General, emoji, produto, tema, painel } = require("../../DataBaseJson")

module.exports = {
   name: "config_painel",
   description: "[🛠️|💰 Vendas Moderação] Configure um painel",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Coloque o id painel!",
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
      
      if (!painel.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Painel inexistente!`, ephemeral: true })
      
      const embed = new EmbedBuilder()
       .setTitle(`${interaction.client.user.username} | Gerenciar Painel`)
       .setDescription(`Escolha oque deseja gerenciar:`)
       .setColor(General.get(`color.padrao`))
       .setFooter({ text: `${interaction.client.user.username} - Todos os direitos reservados.`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })})
       
      const row = new ActionRowBuilder()
       .addComponents(
          new ButtonBuilder()
           .setCustomId(`${interaction.user.id}_${id}_configembed`)
           .setLabel('Configurar Embed')
           .setEmoji(`1136604220246728754`)
           .setStyle(3),
          new ButtonBuilder()
           .setCustomId(`${interaction.user.id}_${id}_configproduto`)
           .setLabel('Configurar Produtos')
           .setEmoji(`1161241239182651413`)
           .setStyle(3),
          new ButtonBuilder()
           .setCustomId(`${interaction.user.id}_${id}_attpainel`)
           .setLabel('Atualizar Painel')
           .setEmoji(`1148666021041950790`)
           .setStyle(1),
          new ButtonBuilder()
           .setCustomId(`${interaction.user.id}_${id}_delpainel`)
           .setLabel('DELETAR')
           .setEmoji(`1140438393373872148`)
           .setStyle(4),
       )
       
      interaction.reply({ embeds: [embed], components: [row] })
      
      setTimeout(() => {
        try {
          interaction.editReply({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] })
        } catch (error) {
          if (error.code == 10008) {
            return
          }
        }
      }, 300000)
   }
}