const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, saldo, rankproduto, rank } = require("../../DataBaseJson")

module.exports = {
   name: "perfil",
   description: "[🧀|💰 Vendas Utilidades] Veja o seu perfil ou o perfil de algum usuário",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "user",
       description: "Mencione o usuário que você deseja ver o perfil.",
       type: ApplicationCommandOptionType.User,
       required: false
     }
   ],
   
   run: async(client, interaction) => {
       const user = interaction.options.getUser('user') || interaction.user
       
       const calculos = rank.all().filter(i => i.data.gastosaprovados).sort((a, b) => b.data.gastosaprovados - a.data.gastosaprovados).findIndex(entry => entry.ID === user.id) + 1
       
       const embed = new EmbedBuilder()
        .setTitle(`Perfil do Usuário | ${user.username}`)
        .setDescription(`${emoji.get(`carrinho`)} | Produtos Comprados: \`${rank.get(`${user.id}.pedidosaprovados`) || "0"}\`\n${emoji.get(`cartao`)} | Já gasto: \`R$${Number(rank.get(`${user.id}.gastosaprovados`)).toFixed(2) || "0"}\`\n${emoji.get(`saco`)} | Saldo: \`R$${Number(saldo.get(user.id)).toFixed(2) || "0"}\`\n${emoji.get(`trofeu`)} | Rank: ${!rank.has(user.id) ? `${user.username} não está no rank!` : `${user.username} está na __${calculos}°__ posição do rank!`}`)
        .setColor(General.get(`color.padrao`))
        
       interaction.reply({ embeds: [embed] })
   }
}