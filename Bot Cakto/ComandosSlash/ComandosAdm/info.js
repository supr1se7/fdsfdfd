const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema, rankproduto, carrinhos } = require("../../DataBaseJson")

module.exports = {
   name: "info",
   description: "[🧀|💰 Vendas Utilidades] Mostra as informações da compra que você colocou o ID",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "id",
       description: "Coloque o ID da compra Aqui!",
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
       
       const id = interaction.options.getString("id")
       
       if (!carrinhos.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Compra não encontrada!`, ephemeral: true })
       
       const carprodutosObject = carrinhos.get(id) || {};
       const products = carprodutosObject.produtos.map(productKey => {
         const product = carprodutosObject[productKey];
         if (product && product.nome && product.quantidade) {
           return `${product.nome} x${product.quantidade}\n`;
         }
       }).join('')
       
       const info = carrinhos.get(id)
       const embed = new EmbedBuilder()
        .setTitle(`Mostrando a compra de Id: ${id}`)
        .setDescription(`${emoji.get(`user`)} **| Compra Feita Por:**\n${interaction.guild.members.cache.get(info.user)} - **${info.user}**\n\n${emoji.get(`produto`)} **| Produto(s) Comprado(s):**\n\`${products}\`\n${emoji.get(`preco`)} **| Valor Pago:**\n\`R$${Number(info.preco).toFixed(2)}\`\n\n${emoji.get(`comprimento`)} **| Método de Pagamento:**\n\`${info.pagamento}\`\n\n${emoji.get(`carrinho`)} **| Cupom:**\n\`${info.cupomutilizado == "Nenhum" ? `NENHUM CUPOM USADO!` : info.cupom}\`\n\n${emoji.get(`presente`)} **| Desconto:**\n\`R$${Number(info.valorcupom).toFixed(2)}\`\n\n${emoji.get(`data`)} **| Data:**\n<t:${Math.floor(info.data / 1000)}:f>(<t:${Math.floor(info.data / 1000)}:R>`)
        .setColor(General.get(`color.padrao`))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        
       interaction.reply({ embeds: [embed] })
   }
}