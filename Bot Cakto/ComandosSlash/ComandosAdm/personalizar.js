const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
  name: "personalizar",
  description: "[🛠️|💰 Vendas Moderação] Personalize a embed",
  run: async(client, interaction) => {
      if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
      
      const embed = new EmbedBuilder()
       .setTitle(`${client.user.username} | Personalizar`)
       .setDescription(`Clique no que você deseja personalizar:`)
       .setColor(General.get(`color.padrao`))
       .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
       
      const row = new ActionRowBuilder()
       .addComponents(
          new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_personalizarembed`)
            .setLabel('Mensagem de Compra')
            .setEmoji(`1136607333204643931`)
            .setStyle(1),
          new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_personalizaremojis`)
            .setLabel('Alterar Emojis Padrões')
            .setEmoji(`1136607333204643931`)
            .setStyle(1),
       )
       
      interaction.reply({ embeds: [embed], components: [row] })
      
      setTimeout(() => {
          try {
            interaction.editReply({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] })
          } catch (error) {
            if (error.code == 10080) {
               return;
            }
          }
       }, 300000)
  }
}