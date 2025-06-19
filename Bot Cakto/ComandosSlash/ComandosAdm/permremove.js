const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji } = require("../../DataBaseJson")

module.exports = {
    name: "permremove",
    description: "[🛠️|💰 Vendas Moderação] Remover a permissão de um usuário!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
           name: "user",
           description: "Selecione o usuário",
           type: ApplicationCommandOptionType.User,
           required: true
        }
    ],
    
    run: async(client, interaction) => {
         if (interaction.user.id != General.get('creator')) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você não possui permissão para utilizar esse comando.`, ephemeral: true })
         
         const userx = interaction.options.getUser("user")
         
         if (!perms.has(userx.id)) return interaction.reply({ content: `${emoji.get(`emojix`)} | O usúario não possui permissão.`, ephemeral: true }) 
         
         perms.delete(userx.id)
         interaction.reply({ content: `${emoji.get('certo')} | Permissão retirado do usuário ${userx} com sucesso.`, ephemeral: true }) 
    }
}