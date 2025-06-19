const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, ComponentType } = require("discord.js")
const { perms, General, emoji, produto, outros, cupons } = require("../../DataBaseJson")

module.exports = {
   name: "criados",
   description: "[🛠️|💰 Vendas Moderação] Veja todos os produtos, cupons, keys, etc. Cadastrados no bot",
   run: async(client, interaction) => {
       if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
       const user = interaction.user.id
       const embed2 = new EmbedBuilder()
        .setTitle(`${client.user.username} | Sistema de Vendas`)
        .setDescription(`Clique no que você deseja ver:`)
        .setColor(General.get(`color.padrao`))
        
       const row = new ActionRowBuilder()
        .addComponents(
           new ButtonBuilder()
            .setCustomId('produtos')
            .setLabel('Produtos')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
           new ButtonBuilder()
            .setCustomId('cupons')
            .setLabel('Cupons')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
           new ButtonBuilder()
            .setCustomId('key')
            .setLabel('Keys')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
           new ButtonBuilder()
            .setCustomId('gift')
            .setLabel('GifCards')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
        )
        
       const row2 = new ActionRowBuilder()
        .addComponents(
           new ButtonBuilder()
            .setCustomId('produtozeroestoque')
            .setLabel('Produtos sem Estoque')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
           new ButtonBuilder()
            .setCustomId('drop')
            .setLabel('Drops')
            .setEmoji(`1136607333204643931`)
            .setStyle(2),
        )
        
       const msg = await interaction.reply({ embeds: [embed2], components: [row, row2] })
       
       setTimeout(() => {
         try {
           msg.edit({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] })
         } catch (error) {
           return
         }
       }, 300000)
       
       const interação = msg.createMessageComponentCollector({ componentType: ComponentType.Button, });
       interação.on("collect", async (interaction) => {
         if (interaction.user.id != interaction.user.id) {
           return;
         }
          
          if (interaction.customId == 'produtos') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = produto.all()
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`produto`)} **| Nome:** ${entry.data.nome}\n${emoji.get(`preco`)} **| Valor:** R$${Number(entry.data.preco).toFixed(2)}\n${emoji.get(`caixa`)} **| Estoque:** ${entry.data.estoque.length}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('Produtos:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
          if (interaction.customId == 'cupons') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = cupons.all()
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`produto`)} **| Nome:** ${entry.data.nome}\n${emoji.get(`preco`)} **| Valor mínimo:** R$${Number(entry.data.valormin).toFixed(2)}\n${emoji.get(`caixa`)} **| Quantidade:** ${entry.data.quantidade}\n${emoji.get(`lupa`)} **| Porcentagem:** ${entry.data.porcentagem}%\n${emoji.get(`user`)} | Cargo: ${interaction.guild.roles.cache.get(entry.data.cargo) || "Todos podem utilizar este cupom!"}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('Cupons:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
          if (interaction.customId == 'key') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = outros.all().filter(x => x.data.tipo == "key")
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`user`)} | Cargo: ${interaction.guild.roles.cache.get(entry.data.cargo) || "Não encontrado"}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('Keys:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
          if (interaction.customId == 'gift') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = outros.all().filter(x => x.data.tipo == "gift")
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`preco`)} | Valor: R$${Number(entry.data.valor).toFixed(2)}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('GifCards:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
          if (interaction.customId == 'drop') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = outros.all().filter(x => x.data.tipo == "drop")
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`caixa`)} **| OQUE SERÁ ENTREGUE:** ${entry.data.entregue}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('Drops:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
          if (interaction.customId == 'produtozeroestoque') {
            if (interaction.user.id != user) return interaction.deferUpdate()
            
            const push = produto.all().filter(x => x.data.estoque.length == 0)
            
            if (push.length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Error: Não encontrei nada desse tipo cadastrado no bot!`, ephemeral: true })
            
            const pageSize = 10
            let page = 0
            
            const displayPage = () => {
              const pagestart = page * pageSize
              const pageend = pagestart + pageSize
              const pageItems = push.slice(pagestart, pageend)
              
              const valores = pageItems.map(entry => `${emoji.get(`label`)} **| ID:** ${entry.ID}\n${emoji.get(`produto`)} **| Nome:** ${entry.data.nome}\n${emoji.get(`preco`)} **| Valor:** R$${Number(entry.data.preco).toFixed(2)}\n${emoji.get(`caixa`)} **| Estoque:** ${entry.data.estoque.length}`).join("\n\n")
              
              const row2 = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                  .setCustomId('primeiraPagina')
                  .setEmoji('⏮️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('voltar')
                  .setEmoji('⬅️')
                  .setDisabled(page == 0)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('mpuaa')
                  .setLabel('ㅤㅤ')
                  .setDisabled(true)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('proximo')
                  .setEmoji('➡️')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
                 new ButtonBuilder()
                  .setCustomId('ultimaPagina')
                  .setEmoji('⏩')
                  .setDisabled(page == Math.ceil(push.length / pageSize) - 1)
                  .setStyle(2),
              )
              
              const embed = new EmbedBuilder()
               .setTitle('Produtos sem Estoque:')
               .setDescription(`${valores}`)
               .setColor(General.get(`color.padrao`))
               .setFooter({ text: `Página ${page + 1}/${Math.ceil(push.length / pageSize)}` })
                    
              return { embed, components: [row2] }
            }
            
            const { embed, components } = displayPage()
            const msg2 = await interaction.reply({ embeds: [embed], components, ephemeral: true })
            
            const filter = i => i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            
            collector.on('collect', interaction2 => {
              interaction2.deferUpdate()
              
              if (interaction2.customId == 'proximo') {
                page += 1;
              } else if (interaction2.customId == 'voltar') {
                page -= 1;
              } else if (interaction2.customId == 'ultimaPagina') {
                page = Math.ceil(push.length / pageSize) - 1;
              } else if (interaction2.customId == 'primeiraPagina') {
                page = 0;
              }
              
              const { embed, components } = displayPage();
              msg2.edit({ embeds: [embed], components })
            })
          }
          
       })
   }
}