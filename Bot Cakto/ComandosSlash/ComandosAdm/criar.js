const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
   name: "criar",
   description: "[💰 Vendas Moderação]Cadastra um novo produto no bot",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Coloque o ID do produto aqui!",
        type: ApplicationCommandOptionType.String,
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
       
       const ide = interaction.options.getString("id")
       
       if (produto.has(ide)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Já existe um produto com esse NOME neste servidor.`, ephemeral: true })
       
       let uu = tema.get('embed.desc') 
       uu = uu.replace('#{desc}', `Não configurado ainda...`)
       uu = uu.replace('#{nome}', `Não configurado`)
       uu = uu.replace('#{preco}', `10.00`)
       uu = uu.replace('#{estoque}', `0`)
       let aa = tema.get('embed.titulo') 
       aa = aa.replace('#{desc}', `Não configurado ainda...`)
       aa = aa.replace('#{nome}', `Não configurado`)
       aa = aa.replace('#{preco}', `10.00`)
       aa = aa.replace('#{estoque}', `0`)
       const embed = new EmbedBuilder()
        .setTitle(aa)
        .setDescription(uu)
        .setColor(General.get(`color.padrao`))
       
       if (tema.get(`embed.rodape`) != "null") {
          embed.setFooter({ text: `${tema.get(`embed.rodape`)}` })
       }
       if (General.get(`images.banner`) != "") {
          embed.setImage(General.get(`images.banner`))
       }
       if (General.get(`images.thumbnail`) != "") {
          embed.setImage(General.get(`images.thumbnail`))
       }
       
       const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
              .setCustomId(`${ide}_comprar`)
              .setLabel(tema.get(`botao.label`))
              .setEmoji(tema.get(`botao.emoji`))
              .setStyle(tema.get(`botao.style`))
         )
       
       interaction.reply({ content: `${emoji.get(`certo`)} | Produto criado com sucesso!, use /config \`${ide}\` Para configura-lo.`, ephemeral: true })
       const msg = await interaction.channel.send({ embeds: [embed], components: [row] })
       
       produto.set(ide, { nome: `Não configurado`, desc: `Não configurado ainda`, preco: 10, estoque: [], banner: General.get(`images.banner`) == "" ? null : General.get(`images.banner`), thumb: General.get(`images.thumb`) == "" ? null : General.get(`images.thumb`), cor: General.get(`color.padrao`), cupom: 'ON', categoria: null, idmsg: msg.id, idcanal: interaction.channel.id, cargo: "null", notify: [] })
   }
}