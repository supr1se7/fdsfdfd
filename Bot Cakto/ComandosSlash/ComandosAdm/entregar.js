const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
   name: "entregar",
   description: "[🛠|💰 Vendas Moderação] Entregue um produto a um usuário",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Id do produto",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true
      },
      {
        name: "usuário",
        description: "Mencione o usuário que irá receber o produto",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "quantidade",
        description: "Selecione a quantidade que será entregue ao usuário",
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
       
       const id = interaction.options.getString("id")
       const user = interaction.options.getUser("usuário")
       const quantidade = interaction.options.getNumber("quantidade")
       
       if (!produto.has(id)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Id do produto selecionado não existe.`, ephemeral: true })
       
       const product = produto.get(id)
       if (quantidade > product.estoque.length) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você digitou um valor maior que o estoque atual.`, ephemeral: true })
       
       if (quantidade <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você digitou um valor menor que o estoque atual.`, ephemeral: true })
       
       const entregar2 = product.estoque
       const entregar = entregar2.splice(0, Number(quantidade))
       produto.set(`${id}.estoque`, entregar2) 
       
       const embed = new EmbedBuilder()
        .setDescription(`${emoji.get(`certo`)} | Olá ${interaction.user} foi enviado \`${quantidade}\` unidade(s) do produto ${product.nome} para o ${user} \n${emoji.get(`estrela`)} | Produto:\n${entregar.map((produtoo, i) => `${emoji.get(`caixa`)} | Entrega do produto: ${product.nome} - ${i+1}/${quantidade}\n${produtoo}`).join('\n\n')}`)
        .setColor(General.get(`color.padrao`))
       
       try {
         await user.send(`${emoji.get(`comprimento`)} | Olá ${user}, chegou uma entrega para você!\n${emoji.get(`lupa`)} | Produto: ${id}\n${emoji.get(`estrela`)} | Aqui está:\n${entregar.map((produtoo, i) => `${emoji.get(`caixa`)} | Entrega do produto: ${product.nome} - ${i+1}/${quantidade}\n${produtoo}`).join('\n\n')}`)
         
         interaction.reply({ embeds: [embed], ephemeral: true })
       } catch (error) {
         interaction.reply({ content: `${emoji.get(`alerta`)} | Erro ao enviar a mensagem!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\``, ephemeral: true })
       }
       
       const canal = interaction.guild.channels.cache.get(General.get(`canais.logs_adm`))
       if (canal) {
          canal.send(`O usuário ${interaction.user} enviou \`${quantidade}\` unidade(s) do produto \`${product.nome}\` para o ${user}`)
       }
   }
}