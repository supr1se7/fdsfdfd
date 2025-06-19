const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji } = require("../../DataBaseJson")

module.exports = {
   name: "permlist",
   description: "[🛠|💰 Vendas Moderação] Veja todos os usuários que possuem permissão no bot",
   run: async(client, interaction) => {
       if (interaction.user.id != General.get('creator')) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você não possui permissão para utilizar esse comando.`, ephemeral: true })
       
       const permsusers = perms.all().map(entry => `${emoji.get(`user`)} | <@${entry.ID}> - \`${entry.ID}\``).join('\n\n')
       
       const embed = new EmbedBuilder()
        .setTitle(`Membros com permissão - ${perms.all().length}`)
        .setDescription(perms.all().length == 0 ? `\`Nenhum usuário possui permissão no seu BOT.\`` : permsusers)
        .setColor(General.get(`color.padrao`))
        
       interaction.reply({ embeds: [embed], ephemeral: true })
   }
}