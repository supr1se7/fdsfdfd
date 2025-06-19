const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "criarkey",
   description: "[🛠️|💰 Vendas Moderação] Crie uma key para um cargo selecionado",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "cargo",
        description: "Selecione um Cargo",
        type: ApplicationCommandOptionType.Role,
        required: true
      },
      {
        name: "qtd",
        description: "Quantidade de Keys a serem Criados",
        type: ApplicationCommandOptionType.Number,
        required: true
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
       
       const cargo = interaction.options.getRole("cargo")
       const qtd = interaction.options.getNumber("qtd")
       
       const embed = new EmbedBuilder()
       .setTitle(`Key criada com sucesso!`)
       .setDescription(`Olhe a DM para ver o código da key.`)
       .setColor(General.get(`color.padrao`))
       .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
       .setTimestamp()
       
      interaction.reply({ embeds: [embed], ephemeral: true })
      
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
      const maxWords = 18;
      const numberOfDuplications = qtd; 
      
      for (let j = 0; j < numberOfDuplications; j++) {
        let generatedWords = '';
        for (let i = 0; i < maxWords; i++) {
          const randomIndex = Math.floor(Math.random() * alphabet.length);
          const randomLetter = alphabet[randomIndex];
          generatedWords += randomLetter + '';
        }
        
        outros.set(`${generatedWords}.idkey`, generatedWords)
        outros.set(`${generatedWords}.tipo`, `key`)
        outros.set(`${generatedWords}.cargo`, cargo.id)
        
        const embedkey = new EmbedBuilder()
         .setTitle(`Key criado!`)
         .setDescription(`Você acabou de gerar uma key com o cargo ${cargo.name}\n\n${emoji.get(`chave`)} **| Código:**\n${generatedWords}`)
         .setColor(General.get(`color.padrao`))
         .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
         .setTimestamp()
        
        interaction.user.send({ embeds: [embedkey] })
        interaction.user.send(`${generatedWords}`)
      }
   }
}