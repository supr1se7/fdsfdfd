const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const { emoji, General, perms } = require("../../DataBaseJson")

module.exports = {
   name: "conectar",
   description: "[🛠️|💰 Vendas Moderação] Faz o bot entrar em um canal de voz",
   options: [
     {
       name: "canal",
       description: "Coloque o canal de voz aqui.",
       type: ApplicationCommandOptionType.Channel,
       channelTypes: [
         ChannelType.GuildVoice,
       ],
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
        
         const canal = interaction.options.getChannel('canal');
         joinVoiceChannel({
            channelId: canal.id,
            guildId: canal.guild.id,
            adapterCreator: canal.guild.voiceAdapterCreator
         })
         
         const embed = new EmbedBuilder()
          .setAuthor({ name: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }) )
          .setDescription(`${emoji.get(`certo`)} | **${interaction.user.username}, entrei no canal de voz: ${canal} com sucesso!**`)
         .setColor(General.get(`color.padrao`))
         .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}