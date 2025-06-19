const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "ativarkey",
   description: "[💰| Vendas Utilidades] Ative uma Key",
   type: ApplicationCommandType.ChatInput,
   options: [
      { 
        name: "key",
        description: "Coloque sua Key aqui!",
        type: ApplicationCommandOptionType.String,
        required: true 
      }
   ],
   
   run: async(client, interaction) => {
       const key = interaction.options.getString("key")
       
       if (!outros.has(key)) return interaction.reply({ content: `${emoji.get(`lupa`)} | essa key não existe`, ephemeral: true })
       
       const role = interaction.guild.roles.cache.get(outros.get(`${key}.cargo`))
       const membro = interaction.guild.members.cache.get(interaction.user.id)
       
       try {
         await membro.roles.add(role)
         
         const embed = new EmbedBuilder()
          .setTitle(`Key ativada com sucesso.`)
          .setDescription(`Você acabou de ativar a key para o cargo ${role}, aproveite!`)
          .setColor(General.get(`color.padrao`))
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
          .setTimestamp()

         interaction.reply({
            embeds: [embed],
            ephemeral: true
         })
         
         const canal = interaction.guild.channels.cache.get(General.get(`canais.logs_adm`))
         
         if (canal) {
            const embedlogs = new EmbedBuilder()
             .setTitle(`Ativação de Key`)
             .setDescription(`O ${interaction.user} acabou de ativar a key para o cargo ${role}`)
             .setColor(General.get(`color.padrao`))
             .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
             .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
             .setTimestamp()
             
            canal.send({
              embeds: [embedlogs]
            })
         }
         
         outros.delete(key)
       } catch (error) {
         interaction.reply({ content: `${emoji.get(`alerta`)} | Erro ao setar o cargo!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\``, ephemeral: true })
       }
   }
}