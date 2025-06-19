const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")

module.exports = {
   name: "config",
   description: "[💰 Vendas Moderação] Configure um produto",
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
       
       const product = produto.get(ide)
       const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${emoji.get(`desc`)} **| Descrição:**\n\n${product.desc}\n\n${emoji.get(`lupa`)} | Id: ${ide}\n${emoji.get(`label`)} | Nome: ${product.nome}\n${emoji.get(`preco`)} | Preço: R$ ${Number(product.preco).toFixed(2)}\n${emoji.get(`caixa`)} | Estoque quantidade: ${product.estoque.length}`)
        .setColor(General.get(`color.padrao`))
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
       const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_altnome`)
              .setLabel('NOME')
              .setEmoji(`1136604220246728754`)
              .setStyle(3),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_altpreco`)
              .setLabel('PREÇO')
              .setEmoji(`1136604253062955008`)
              .setStyle(3),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_altdesc`)
              .setLabel('DESCRIÇÃO')
              .setEmoji(`1184105676545474631`)
              .setStyle(3),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_configestoque`)
              .setLabel('ESTOQUE')
              .setEmoji(`1136604285887586324`)
              .setStyle(3),
         )
        
        const row2 = new ActionRowBuilder()
         .addComponents(
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_configavancada`)
              .setLabel('Configurações Avançadas')
              .setEmoji(`1136607333204643931`)
              .setStyle(1),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_attmsg`)
              .setLabel('Atualizar Mensagem')
              .setEmoji(`1148666021041950790`)
              .setStyle(1),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_delproduto`)
              .setLabel('DELETAR')
              .setEmoji(`1140438393373872148`)
              .setStyle(4),
            new ButtonBuilder()
              .setCustomId(`${interaction.user.id}_${ide}_infoproduto`)
              .setEmoji(`1136607825758527529`)
              .setStyle(1),
          )
          
         interaction.reply({ embeds: [embed], components: [row, row2] })
         
         setTimeout(() => {
            interaction.editReply({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] }).catch(error => {return})
         }, 300000)
   }
}