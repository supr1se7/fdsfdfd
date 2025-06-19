const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji } = require("../../DataBaseJson")

module.exports = {
   name: "botconfig",
   description: "[🛠️|💰 Vendas Moderação] Configure o bot",
   run: async(client, interaction) => {
       if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
       const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`${emoji.get(`config`)} | **Painel de Configuração do bot**\n\n⚙️ | Sistema de Vendas: ${General.get(`vendas`)}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)
        .setColor(General.get(`color.padrao`))
        
       const row = new ActionRowBuilder()
        .addComponents(
           new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_vendasonoff`)
            .setLabel('Vendas On/Off')
            .setEmoji(`1136607333204643931`)
            .setStyle(General.get(`vendas`) == "ON" ? 3 : 4),
           new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_configpayment`)
            .setLabel('Configurar Pagamento')
            .setEmoji(`1157338170757746729`)
            .setStyle(1),
           new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_configbot`)
            .setLabel('Configurar Bot')
            .setEmoji(`1136604220246728754`)
            .setStyle(1),
           new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_configcanais`)
            .setLabel('Configurar Canais')
            .setEmoji(`1136607333204643931`)
            .setStyle(1),
           new ButtonBuilder()
            .setCustomId(`${interaction.user.id}_configtermos`)
            .setLabel('Configurar os Termos de compra')
            .setEmoji(`1184105676545474631`)
            .setStyle(1)
        )
        
        const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
           .setCustomId(`${interaction.user.id}_blacklist`)
           .setLabel('Personalizar BlackList')
           .setEmoji(`1209132660576878602`)
           .setStyle(4)
        )
        
       interaction.reply({ embeds: [embed], components: [row, row2] })
       
       setTimeout(() => {
          interaction.editReply({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] }).catch(error => {return})
       }, 300000)
   }
}