const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros, saldo } = require("../../DataBaseJson")

module.exports = {
   name: "resgatargift",
   description: "[🛠|💰 Vendas Moderação] Resgate um gift-card de Saldo",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "codigo",
       description: "Coloque sua key Aqui!",
       type: ApplicationCommandOptionType.String,
       required: true
     }
   ],
   
   run: async(client, interaction) => {
       const codigo = interaction.options.getString("codigo")
       
       if (!outros.has(codigo)) return interaction.reply({ content: `${emoji.get(`lupa`)} | essa key não existe`, ephemeral: true })
       
       saldo.add(interaction.user.id, outros.get(`${codigo}.valor`))
       
       const embed = new EmbedBuilder()
        .setTitle('Gift resgatado com sucesso.')
        .setDescription(`Você acabou de resgatar um gift no valor de \`R$${Number(outros.get(`${codigo}.valor`)).toFixed(2)}\` e agora você tem \`R$${Number(saldo.get(interaction.user.id)).toFixed(2)}\``)
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        
       interaction.reply({ embeds: [embed], ephemeral: true })
       
       const embedlogs = new EmbedBuilder()
        .setTitle(`Reivindicação de gift`)
        .setDescription(`O ${interaction.user}, acabou de resgatar um gift no valor de \`R$${Number(outros.get(`${codigo}.valor`)).toFixed(2)},\` e agora ele está com \`R$${Number(saldo.get(interaction.user.id)).toFixed(2)}\``)
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        
       const canal = interaction.guild.channels.cache.get(General.get(`canais.logs_adm`))
       
       if (canal) {
          canal.send({ embeds: [embedlogs] })
       }
       
       outros.delete(codigo)
   }
}