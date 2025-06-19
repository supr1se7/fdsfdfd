const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "pegardrop",
   description: "[🧀|💰 Vendas Utilidades] Pegar um Drop",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "codigo",
        description: "Coloque o Código aqui!",
        type: ApplicationCommandOptionType.String,
        required: true
      }
   ],
   
   run: async(client, interaction) => {
       const codigo = interaction.options.getString("codigo")
       
       if (!outros.has(codigo)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você inseriu um código inválido/usado!`, ephemeral: true })
       
       const embed = new EmbedBuilder()
        .setTitle('Drop resgatado com sucesso!')
        .setDescription(`${emoji.get(`chave`)} **| Código:**\n${codigo}\n${emoji.get(`sorteio`)} **| Item resgatado:**\n${outros.get(`${codigo}.entregue`)}`)
        .setTimestamp()
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        
       interaction.reply({ embeds: [embed], ephemeral: true })
       interaction.user.send({ embeds: [embed] })
       interaction.user.send(outros.get(`${codigo}.entregue`))
       
       const embedlogs = new EmbedBuilder()
        .setTitle(`O ${interaction.user} Acabou de resgatar um drop!`)
        .setDescription(`${emoji.get(`chave`)} **| Código:**\n${codigo}\n${emoji.get(`sorteio`)} **| Item resgatado:**\n${outros.get(`${codigo}.entregue`)}`)
        .setTimestamp()
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        
       const canal = interaction.guild.channels.cache.get(General.get(`canais.logs_adm`))
       if (canal) {
          canal.send({ embeds: [embedlogs] })
       }
       
       outros.delete(codigo)
   }
}