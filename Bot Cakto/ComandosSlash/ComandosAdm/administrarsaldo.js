const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, ComponentType } = require("discord.js")
const { perms, General, emoji, saldo } = require("../../DataBaseJson")

module.exports = {
   name: "administrarsaldo",
   description: "[🛠️|💰 Vendas Moderação] Gerenciar Saldo",
   type: ApplicationCommandType.ChatInput,
   options: [
      { 
        name: "ação",
        description: "Adicionar ou Remover?",
        type: ApplicationCommandOptionType.String,
        choices: [{ name: `Adicionar`, value: `add`}, { name: `Remover`, value: `remover` }],
        required: true
      },
      {
        name: "user",
        description: "Mencione o usuário para gerenciar seu saldo",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "valor",
        description: "Valor para remover ou adicionar ao usuário selecionado.",
        type: ApplicationCommandOptionType.Number,
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
       
       const acao = interaction.options.getString("ação")
       const user = interaction.options.getUser("user")
       const valor = interaction.options.getNumber("valor")
       
       switch (acao) {
          case 'add':
            const embed = new EmbedBuilder()
             .setTitle(`Saldo adicionado para ${user.username}`)
             .setDescription(`O ${user} tinha \`R$${Number(saldo.get(user.id)).toFixed(0)},\` foi adicionado \`R$${valor.toFixed(0)},\` agora ele está com \`R$${saldo.get(user.id) + valor}\``)
             .setColor(General.get(`color.padrao`))
             .setThumbnail(user.displayAvatarURL({ dynamic: true }))
             .setFooter({ text: `Autor: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true })})
             .setTimestamp()
             
            interaction.reply({ embeds: [embed] })
            saldo.add(user.id, valor)
            break;
          case 'remover': 
            if (saldo.get(user.id) < valor) return interaction.reply(`${emoji.get(`lupa`)} | O ${user}, tem atualmente \`R$${Number(saldo.get(user.id)).toFixed(0)}\`, não é possível retirar saldo deste usuário!`)
            
            const embed2 = new EmbedBuilder()
             .setTitle(`Saldo retirado do ${user.username}`)
             .setDescription(`O ${user} tinha \`R$${Number(saldo.get(user.id)).toFixed(0)},\` foi retirado \`R$${valor.toFixed(0)},\` agora ele está com \`R$${saldo.get(user.id) - valor}\``)
             .setColor(General.get(`color.padrao`))
             .setThumbnail(user.displayAvatarURL({ dynamic: true }))
             .setFooter({ text: `Autor: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true })})
             .setTimestamp()
             
            interaction.reply({ embeds: [embed2] })
            saldo.set(user.id, saldo.get(user.id) - valor)
            break;
       }
   }
}