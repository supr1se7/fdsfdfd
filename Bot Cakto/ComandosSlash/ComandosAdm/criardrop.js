const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require("discord.js")
const { perms, General, emoji, produto, outros } = require("../../DataBaseJson")

module.exports = {
   name: "criardrop",
   description: "[🛠|💰 Vendas Moderação] Crie um Drop",
   run: async(client, interaction) => {
       if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
       const modal = new ModalBuilder()
        .setCustomId('modalcriardrop')
        .setTitle('Criar Drop')
        
       const text1 = new TextInputBuilder()
        .setCustomId('codigo')
        .setLabel('CODIGO:')
        .setPlaceholder('Insira o código desse drop')
        .setRequired(true)
        .setStyle(1)
      
       const text2 = new TextInputBuilder()
        .setCustomId('entregue')
        .setLabel('OQUE SERÁ ENTREGUE?:')
        .setPlaceholder('Coloque aqui oque o usuario ira receber quando resgatar esse drop.')
        .setRequired(true)
        .setStyle(2)
        
       modal.addComponents(new ActionRowBuilder().addComponents(text1), new ActionRowBuilder().addComponents(text2))
       
       interaction.showModal(modal)
       
       client.on('interactionCreate', async (interaction) => {
         if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith("modalcriardrop")) {
               const codigo = interaction.fields.getTextInputValue("codigo")
               const entregue = interaction.fields.getTextInputValue("entregue")
               
               const embed = new EmbedBuilder()
                .setTitle('Drop Criado!')
                .setDescription(`Você acabou de criar um drop, para alguem resgatar só utilizar o comando \`/pegardrop\` e inserir o código: \`${codigo}\`\n\n${emoji.get(`chave`)} **| Código:**\n${codigo}\n\n${emoji.get(`sorteio`)} **| OQUE SERÁ ENTREGUE:**\n${entregue}`)
                .setColor(General.get(`color.padrao`))
                
               outros.set(`${codigo}.iddrop`, codigo)
               outros.set(`${codigo}.tipo`, `drop`)
               outros.set(`${codigo}.entregue`, entregue)
               
               interaction.reply({ embeds: [embed], ephemeral: true })
               interaction.user.send({ embeds: [embed] })
               interaction.user.send(codigo)
            }
         }
       })
   }
}