const {PermissionFlagsBits, ApplicationCommandType, ApplicationCommandOptionType} = require("discord.js")
const {emoji} = require("../../DataBaseJson")

module.exports = {
    name: "say",
    description: "[🛠️ | Moderação] Faça eu falar",
    type: ApplicationCommandType.ChatInput,
    options: [
       {
           name: "texto",
           description: "Coloque o texto aqui.",
           type: ApplicationCommandOptionType.String,
           required: true
       } 
    ],
    
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você não possui permissão para utilizar esse comando.`, ephemeral: true })
        
        interaction.reply({ content: `${emoji.get(`certo`)} | Mensagem Enviada!`, ephemeral: true })
        interaction.channel.send(interaction.options.getString("texto"))
    }
}