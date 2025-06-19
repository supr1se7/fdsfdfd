const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
   name: "set",
   description: "[🛠|💰 Vendas Moderação] Sete um Produto",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Coloque o ID do produto aqui!",
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
       
       const ide = interaction.options.getString("id")
       
       if (!produto.has(ide)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Id do produto selecionado não existe.`, ephemeral: true })
       
       const u = produto.get(ide)
       let desc = tema.get('embed.desc') 
       desc = desc.replace('#{desc}', `${u.desc}`)
       desc = desc.replace('#{nome}', `${u.nome}`)
       desc = desc.replace('#{preco}', `${Number(u.preco).toFixed(2)}`)
       desc = desc.replace('#{estoque}', `${u.estoque.length}`)
       let titulo = tema.get('embed.titulo') 
       titulo = titulo.replace('#{desc}', `${u.desc}`)
       titulo = titulo.replace('#{nome}', `${u.nome}`)
       titulo = titulo.replace('#{preco}', `${Number(u.preco).toFixed(2)}`)
       titulo = titulo.replace('#{estoque}', `${u.estoque.length}`)
       
       const embed = new EmbedBuilder()
        .setTitle(titulo)
        .setDescription(desc)
        .setColor(u.cor)
        
       if (u.banner != null) embed.setImage(u.banner)
       if (u.thumb != null) embed.setThumbnail(u.thumb)
       if (tema.get(`embed.rodape`) != "null") embed.setFooter({ text: `${tema.get(`embed.rodape`)}` })
       
       const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`${ide}_comprar`)
            .setLabel(tema.get(`botao.label`))
            .setEmoji(tema.get(`botao.emoji`))
            .setStyle(tema.get(`botao.style`))
         )
         
        interaction.reply({ content: `${emoji.get(`certo`)} | Mensagem Atualizada!`, ephemeral: true })
        const msg = await interaction.channel.send({ embeds: [embed], components: [row] })
        
        try {
          const canal = await interaction.guild.channels.cache.get(produto.get(`${ide}.idcanal`))
          const message = await canal.messages.fetch(produto.get(`${ide}.idmsg`))
          
          message.delete()
        } catch (error) {
          // maioria dos erros são por que a mensagem não existe
        } finally {
          produto.set(`${ide}.idmsg`, msg.id) 
          produto.set(`${ide}.idcanal`, interaction.channel.id)
        }
   }
}