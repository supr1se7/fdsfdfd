const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "criargift",
   description: "[🛠|💰 Vendas Moderação] Cria um giftcard com o valor escolhido",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "valor",
       description: "Valor para ser resgatado.",
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
       
       const valor = interaction.options.getNumber("valor")
       
       const embed = new EmbedBuilder()
        .setTitle(`Gift criado com sucesso.`)
        .setDescription(`Olhe a DM para ver o código do gift.`)
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
       interaction.reply({ embeds: [embed] })
       
       const alphabet = "ABCDFGHIJKLMNOPQRSTUVWXYZ123456789";
       const maxWords = 18
       
       let codigo = ''
       for (let i = 0; i < maxWords; i++) {
          const randomIndex = Math.floor(Math.random() * alphabet.length)
          const randomLetter = alphabet[randomIndex]
          codigo += randomLetter
       }
       
       const embedlogs = new EmbedBuilder()
        .setTitle('Gift criado!')
        .setDescription(`Você acabou de gerar um gift no valor de R$${valor.toFixed(2)}`)
        .addFields(
           { name: `${emoji.get(`chave`)} | Código`, value: `${codigo}` }
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
        interaction.user.send({ embeds: [embedlogs] })
        interaction.user.send(codigo)
        
        outros.set(`${codigo}.idgift`, codigo)
        outros.set(`${codigo}.tipo`, `gift`)
        outros.set(`${codigo}.valor`, valor)
   }
}