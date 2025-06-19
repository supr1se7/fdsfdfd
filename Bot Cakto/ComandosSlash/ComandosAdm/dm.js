const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const {emoji} = require("../../DataBaseJson")

module.exports = {
   name: "dm",
   description: "[🛠| Moderação] Envie uma mensagem no privado de um usuário.",
   type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "usuario",
        description: "Mencione um usuário.",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "mensagem",
        description: "Escolha a mensagem para enviar para o usuario",
        type: ApplicationCommandOptionType.String,
        required: true
      },
    ],
    
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você não possui permissão para utilizar esse comando!`, ephemeral: true })
        
        const user = interaction.options.getUser("usuario")
        const msg = interaction.options.getString("mensagem")
        
        try {
          await user.send(msg)
          interaction.reply({ content: `${emoji.get(`certo`)} | Mensagem enviada com sucesso no privado do usuário ${user}.`, ephemeral: true })
        } catch (error) {
          interaction.reply({ content: `${emoji.get(`alerta`)} | Erro ao enviar a mensagem!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\``, ephemeral: true })
        }
    }
}