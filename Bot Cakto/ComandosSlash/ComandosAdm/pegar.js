const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema, rankproduto, carrinhos } = require("../../DataBaseJson")

module.exports = {
   name: "pegar",
   description: "[🧀|💰 Vendas Utilidades] Mostra o produto que foi entregue da compra que você colocou o ID",
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
       const id = interaction.options.getString("id")
       
       if (!carrinhos.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Compra não encontrada!`, ephemeral: true })
       
       if (interaction.user.id != carrinhos.get(`${id}.user`)) {
          if (!perms.has(interaction.user.id)) return interaction.reply({
               embeds: [new EmbedBuilder()
                  .setTitle(`Erro permissão`)
                  .setDescription(`Você não tem permissão para ver informações dessa compra!`)
                  .setColor(General.get(`color.padrao`))
                  .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                ],
               ephemeral: true
            })
       }
       
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
        .setDescription(`${emoji.get(`user`)} **| Compra Feita Por:**\n${interaction.guild.members.cache.get(info.user)} - **${info.user}**\n\n${emoji.get(`produto`)} **| Produto(s) Comprado(s):**\n\`${products}\`\n${emoji.get(`preco`)} **| Valor Pago:**\n\`R$${Number(info.preco).toFixed(2)}\`\n\n${emoji.get(`estrela`)} **| Produto(s) Entregue(s):**\n\`\`\`${info.entregue}\`\`\``)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
       
       try {
         await interaction.user.send({ embeds: [embed] })
         interaction.reply({ content: `${emoji.get(`certo`)} | Verifique o seu privado`, ephemeral: true })
       } catch (error) {
         interaction.reply({ content: `${emoji.get(`alerta`)} | Erro ao enviar a mensagem!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\``, ephemeral: true })
       }
   }
}