const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, AttachmentBuilder, ComponentType } = require("discord.js");
const { perms, General, emoji, produto, tema, rankproduto, carrinhos, rank } = require("../../DataBaseJson");

module.exports = {
   name: "rankprodutos",
   description: "[🛠️|💰 Vendas Moderação] Veja os produtos que mais geraram lucro!",
   run: async(client, interaction) => {
       if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
       const quemmaisgastou = rankproduto.all().filter(i => i.data.totalganho).sort((a, b) => b.data.totalganho - a.data.totalganho)
       
       if (quemmaisgastou.length <= 0) return interaction.reply({
          embeds: [new EmbedBuilder()
             .setTitle(`Erro - Sistema`)
             .setDescription(`Não encontrei nada desse tipo cadastrado no bot`)
             .setColor(General.get(`color.padrao`))
           ],
          ephemeral: true
       })
       
       const pageSize = 10
       let page = 0
       const author = interaction.user.id
       
       const displayPage = () => {
         const pageStart = page * pageSize
         const pageEnd = pageStart + pageSize
         const pageItems = quemmaisgastou.slice(pageStart, pageEnd)
         
         let start = (page - 1) * pageSize
         let end = start + pageSize
         
         const numInicial = page * pageSize + 1
         
         const rankprodutocompleto = pageItems.map((entry, index) => {
            const numrankprodutoing = numInicial + index
            
            let medalha = ''
            
            if (numrankprodutoing === 1) {
              medalha = '🥇'
            } else if (numrankprodutoing === 2) {
              medalha = '🥈'
            } else if (numrankprodutoing === 3) {
              medalha = '🥉'
            } else {
              medalha = '🏅'
            }
            
            return `${medalha} | **__${numrankprodutoing}°__** - ${produto.get(`${entry.ID}.nome`)} - ${entry.ID}\n${emoji.get(`cartao`)} | Rendeu: **R$${Number(entry.data.totalganho).toFixed(2)}**\n${emoji.get(`carrinho`)} | Total de Vendas: ${entry.data.totalvendas}`
         }).join('\n\n')
         
         const row = new ActionRowBuilder()
          .addComponents(
             new ButtonBuilder()
               .setCustomId('primeirapage')
               .setEmoji('⏮️')
               .setDisabled(page == 0)
               .setStyle(2),
             new ButtonBuilder()
               .setCustomId('voltarpage')
               .setEmoji('⬅️')
               .setDisabled(page == 0)
               .setStyle(2),
             new ButtonBuilder()
               .setCustomId('gopage')
               .setLabel('Go To Page')
               .setEmoji('📄')
               .setDisabled(quemmaisgastou.length <= 10)
               .setStyle(3),
             new ButtonBuilder()
               .setCustomId('proximapage')
               .setEmoji('➡️')
               .setDisabled(page === Math.ceil(quemmaisgastou.length / pageSize) - 1)
               .setStyle(2),
             new ButtonBuilder()
               .setCustomId('ultimapage')
               .setEmoji('⏭️')
               .setDisabled(page === Math.ceil(quemmaisgastou.length / pageSize) - 1)
               .setStyle(2),
          )
         
         const embed = new EmbedBuilder()
          .setTitle('Rank Produtos')
          .setDescription(`\n${rankprodutocompleto}`)
          .setColor(General.get(`color.padrao`))
          .setFooter({ text: `Página ${page + 1}/${Math.ceil(quemmaisgastou.length / pageSize)}`})
          
         return { embed, components: [row] }
       }
       
       const { embed, components } = displayPage()
       const msg = await interaction.reply({ embeds: [embed], components })
       
       const filter = i => i.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter });
        collector.on('collect', interaction2 => {
         interaction2.deferUpdate()
         
         if (interaction2.customId == 'proximapage') {
            page += 1
         }
         if (interaction2.customId == 'ultimapage') {
            page = Math.ceil(quemmaisgastou.length / pageSize) - 1;
         }
         if (interaction2.customId == 'voltarpage') {
            page -= 1
         }
         if (interaction2.customId == 'primeirapage') {
            page = 0
         }
         if (interaction2.customId == 'gopage') {
            const embedper = new EmbedBuilder()
             .setTitle(`Página de Rank:`)
             .setDescription(`Envie o numero da página que você deseja ver:`)
             .setColor(General.get(`color.padrao`))
             
            interaction.channel.send({ embeds: [embedper] }).then(msg2 => {
            
            const collectorFilter = response => {
                return response.author.id === interaction.user.id;
             };
             interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
             .then(async colleted => {
               const receivedMessage = colleted.first();
               receivedMessage.delete()
                msg2.delete()
                const newPage = parseFloat(receivedMessage.content)
                if (!isNaN(newPage) && newPage >= 1 && newPage <= Math.ceil(quemmaisgastou.length / pageSize)) {
                  page = newPage - 1;
                  const { embed, components } = displayPage();

                  await interaction.editReply({ embeds: [embed], components });
                } else {
                  msg2.delete()
                  return
                }
             })
         })
         }
         
         const { embed, components } = displayPage()
         interaction.editReply({ embeds: [embed], components })
       })
   }
}