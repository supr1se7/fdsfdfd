const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder } = require("discord.js")
const { perms, General, emoji, produto, tema, painel } = require("../../DataBaseJson")

module.exports = {
   name: "criarpainel",
   description: "[🛠️|💰 Vendas Moderação] Crie um Painel Select Menu Para Seus Produtos",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "id",
        description: "Coloque um id para o seu painel!",
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: "produto_id",
        description: "Coloque o id de um produto para ser adicionado no painel!",
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
       const produtoid = interaction.options.getString("produto_id")
       
       if (painel.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Já existe um painel com esse id, use /config_painel ${id}, para configura-lo`, ephemeral: true })
       
       if (!produto.has(produtoid)) return interaction.reply({ content: `${emoji.get(`emojix`)} | O id do produto é inválido!`, ephemeral: true })
       
       const embed = new EmbedBuilder()
        .setTitle('Não configurado ainda...')
        .setDescription('Não configurado ainda...')
        .setColor(General.get(`color.padrao`))
        
       const pug = produto.get(produtoid)
       const select = new ActionRowBuilder()
        .addComponents(
           new StringSelectMenuBuilder()
             .setCustomId(`${id}_comprar`)
             .setPlaceholder('Selecione um Produto')
             .addOptions([
                {
                  label: pug.nome,
                  description: `💸 | Valor: R$${Number(pug.preco).toFixed(2)} - 📦 | Estoque: ${pug.estoque.length}`,
                  emoji: `1161241239182651413`,
                  value: `${produtoid}_comprar`
                }
              ])
        )
        
       interaction.reply({ content: `${emoji.get(`certo`)} | Painel criado com sucesso!, use /config_painel \`${id}\` Para configura-lo`, ephemeral: true})
       const msg = await interaction.channel.send({ embeds: [embed], components: [select] })
       
       painel.set(id, { titulo: 'Não configurado ainda...', desc: 'Não configurado ainda...', rodape: "null", placeholder: 'Selecione um Produto', cor: General.get(`color.padrao`), banner: "null", thumb: "null", idmsg: msg.id, idcanal: interaction.channel.id, produtos: [`${produtoid}`] })
   }
}