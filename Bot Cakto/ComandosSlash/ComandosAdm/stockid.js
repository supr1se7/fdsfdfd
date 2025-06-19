const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema } = require("../../DataBaseJson")
const fs = require('fs')

module.exports = {
   name: "stockid",
   description: "[🛠|💰 Vendas Moderação] Veja o estoque de um determinado produto",
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
       
       if (produto.get(`${ide}.estoque`).length <= 0) return interaction.reply({ content: `${emoji.get(`emojix`)} | Este produtos não possui estoque!`, ephemeral: true })
       
       const estoqueCompleto = produto.get(`${ide}.estoque`).map((entry, index) => {
          return `${index+1} - ${entry}`
       })
       const pasta = `stock_${ide}.txt`
       
       fs.writeFile(`stock_${ide}.txt`, `📦 | Seu Estoque:\n${estoqueCompleto}`, (err) => {
         if (err) throw err;
       })
       
       const embed = new EmbedBuilder()
        .setTitle(`Mostrando estoque de: ${ide}`)
        .setDescription(`\`\`Estoque no arquivo txt.\`\``)
        .setColor(General.get(`color.padrao`))
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: interaction.user.avatarURL({ dynamic: true })})
        
       interaction.reply({ files: [pasta], embeds: [embed], ephemeral: true })
       
       setTimeout(() => {
         fs.unlink(pasta, (err) => {
            if (err) {
              console.error(`Erro ao apagar o arquivo: ${err}`);
              return;
            }
         })
       }, 6000)
   }
}