const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, cupons } = require("../../DataBaseJson")

module.exports = {
   name: "configcupom",
   description: "[🛠️|💰 Vendas Moderação] Configure um Cupom",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "nome",
        description: "Coloque o nome do cupom aqui!",
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
       
       const nome = interaction.options.getString("nome")
       
       if (!cupons.has(nome)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Cupom inexistente.`, ephemeral: true })
       
       const anna = cupons.get(nome)
       const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Gerenciar Cupom`)
        .setDescription(`Cupom sendo gerenciado:\n\n${emoji.get(`lupa`)} **| Nome:** \`${nome}\`\n${emoji.get(`desc`)} **| Porcentagem:** \`${anna.porcentagem}\`\n${emoji.get(`preco`)} **| Valor mínimo:** \`R$${Number(anna.valormin).toFixed(2)}\`\n${emoji.get(`caixa`)} **| Quantidade:** \`${anna.quantidade}\`\n${emoji.get(`cadeado`)} **| Cargo:** ${interaction.guild.roles.cache.get(anna.cargo) || "\`Todos podem utilizar este cupom!\`"}`)
        .setColor(General.get(`color.padrao`))
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        
       const row = new ActionRowBuilder()
        .addComponents(
           new ButtonBuilder()
             .setCustomId(`${interaction.user.id}_${nome}_altporcentagem`)
             .setLabel('Porcentagem de Desconto')
             .setEmoji(`1136604253062955008`)
             .setStyle(3),
           new ButtonBuilder()
             .setCustomId(`${interaction.user.id}_${nome}_altvalormin`)
             .setLabel('Valor Mínimo')
             .setEmoji(`1161241239182651413`)
             .setStyle(3),
           new ButtonBuilder()
             .setCustomId(`${interaction.user.id}_${nome}_altquantiadecp`)
             .setLabel('Quantidade')
             .setEmoji(`1184105676545474631`)
             .setStyle(3),
           new ButtonBuilder()
             .setCustomId(`${interaction.user.id}_${nome}_cargocupom`)
             .setLabel('Cargo')
             .setEmoji(`1157337774622519296`)
             .setStyle(3),
           new ButtonBuilder()
             .setCustomId(`${interaction.user.id}_${nome}_delcupom`)
             .setLabel('DELETAR')
             .setEmoji(`1140438393373872148`)
             .setStyle(4),
        )
        
       interaction.reply({ embeds: [embed], components: [row] })
       
       setTimeout(() => {
          try {
            interaction.editReply({ content: `${emoji.get(`alerta`)} | Utilize o Comando Novamente!`, embeds: [], components: [] })
          } catch (error) {
            if (error.code == 10080) {
               return;
            }
          }
       }, 300000)
   }
}