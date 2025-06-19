const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder } = require("discord.js")
const { perms, General, emoji, produto, tema, painel } = require("../../DataBaseJson")

module.exports = {
   name: "set_painel",
   description: "[🛠️|💰 Vendas Moderação] Sete o Painel",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "id",
       description: "Coloque o ID do painel que será setado aqui!",
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
      
      const id = interaction.options.getString("id")
      
      if (!painel.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Painel inexistente!`, ephemeral: true })
      
      const info = painel.get(id)
      const embed = new EmbedBuilder()
       .setTitle(info.titulo)
       .setDescription(info.desc)
       .setColor(info.cor)
       
      if (info.banner != "null") embed.setImage(info.banner)
      if (info.thumb != "null") embed.setThumbnail(info.thumb)
      if (info.rodape != "null") embed.setFooter({ text: info.rodape })
      
      const products = []
      painel.get(`${id}.produtos`).forEach(x => {
        const info = produto.get(x)
        products.push({
          label: info.nome,
          description: `💸 | Valor: R$${Number(info.preco).toFixed(2)} - 📦 | Estoque: ${info.estoque.length}`,
          emoji: info.emoji || "<:carrinho_Lgt:1161241239182651413>",
          value: `${x}_comprar`
        })
      })
      
      const rowprodutos = new ActionRowBuilder()
      .addComponents(
         new StringSelectMenuBuilder()
          .setCustomId(`${id}_comprar`)
          .setPlaceholder(info.placeholder)
          .addOptions(products)
       )
       
       interaction.reply({ content: `${emoji.get(`certo`)} | Mensagem Atualizada!`, ephemeral: true })
       const msg = await interaction.channel.send({ embeds: [embed], components: [rowprodutos] })
       
       try {
          const canal = await interaction.guild.channels.cache.get(info.idcanal)
          const message = await canal.messages.fetch(info.idmsg)
          
          message.delete()
        } catch (error) {
          if (error.code == 10008) {
            throw error;
          }
        }
        
       painel.set(`${id}.idmsg`, msg.id)
       painel.set(`${id}.idcanal`, interaction.channel.id)
   }
}