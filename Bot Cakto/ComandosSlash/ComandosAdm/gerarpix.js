const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, ComponentType } = require("discord.js")
const { perms, General, emoji } = require("../../DataBaseJson")
const { MercadoPagoConfig, Payment } = require('mercadopago')
const axios = require('axios')

module.exports = {
   name: "gerarpix",
   description: "[💰|Vendas] Gere uma cobrança",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "valor",
        description: "Valor do pagamento.",
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
       
       if (!General.get(`paymentauto.access_token`).includes("APP_USR")) return interaction.reply({ content: `${emoji.get(`alerta`)} | Função apenas com mercado pago.`, ephemeral: true })
       
       const valor = interaction.options.getNumber("valor")
       const msga = await interaction.reply({ content: `${emoji.get(`carregando`)} | Gerando pagamento...` })
       
       const author = interaction.user.id
       
       const timer = setTimeout(() => {
          interaction.editReply({ content: `${emoji.get(`lupa`)} | Pagamento expirado!`, embeds: [], components: [] })
       }, General.get(`paymentauto.tempopagar`) * 60 * 1000)
       
       const mpLogin = new MercadoPagoConfig({ accessToken: General.get(`paymentauto.access_token`) })
       const payment = new Payment(mpLogin)
       
       const payment_data = {
         transaction_amount: valor,
         description: `Cobrança - ${interaction.user.username}`,
         payment_method_id: "pix",
         payer: {
           email: "cliente@gmail.com",
         }
       }

       try {
         const data = await payment.create({ body: payment_data })
         const buffer = Buffer.from(data.point_of_interaction.transaction_data.qr_code_base64, "base64");
         const attachment = new AttachmentBuilder(buffer, "payment.png");
          
          const row = new ActionRowBuilder()
          .addComponents(
             new ButtonBuilder()
              .setLabel("Pix Copia e Cola")
              .setEmoji(`<:PIX:1158901133692117022>`)
              .setCustomId("cpcpix")
              .setStyle(1),
             new ButtonBuilder()
              .setLabel("Qr Code")
              .setEmoji(`<:9_qr:1141320238361747526>`)
              .setCustomId("qrcpix")
              .setStyle(1),
             new ButtonBuilder()
              .setEmoji(`1136612240217346092`)
              .setCustomId("cancelaarpix")
              .setStyle(4)
           )
           
          let agora = new Date();
          agora.setMinutes(agora.getMinutes() + Number(General.get(`paymentauto.tempopagar`)))
          const time = Math.floor(agora.getTime() / 1000);
          const embed = new EmbedBuilder()
           .setTitle(`${client.user.username} | Sistema de pagamento`)
           .setDescription(`\`\`\`Pagamento gerado com sucesso!\`\`\`\n${emoji.get(`preco`)} | Valor:\nR$${valor.toFixed(2)}\n${emoji.get(`lupa`)} | Pagamento expira em:\n<t:${time}:f> (<t:${time}:R>)`)
           .setColor(General.get(`color.padrao`))
           
          msga.edit({ content: ``, embeds: [embed], components: [row] }).then(msg => {
          
          const interação = msg.createMessageComponentCollector({ componentType: ComponentType.Button, });
          interação.on("collect", async (interaction) => {
            if (interaction.user.id != interaction.user.id) {
              return;
            }
             
             if (interaction.customId == 'cpcpix') {
                interaction.reply({ content: `${data.point_of_interaction.transaction_data.qr_code}`, ephemeral: true })
             }
             
             if (interaction.customId == 'qrcpix') {
                interaction.reply({ files: [attachment], ephemeral: true })
             }
             
             if (interaction.customId == 'cancelaarpix') {
                interaction.deferUpdate()
                if (interaction.user.id != author) return
                clearTimeout(timer)
                msg.edit({ content: `${emoji.get(`lupa`)} | Pagamento cancelado!`, embeds: [], components: [] })
             }
          })
          })
          
          const checkPaymentStatus = setInterval(async () => {
            const infoPayment = await payment.get({ id: data.id })
            
            if (infoPayment.status === "approved") {
              clearInterval(checkPaymentStatus);
              interaction.editReply({ content: `${emoji.get(`certo`)} | Pagamento aprovado com sucesso!`, embeds: [], components: [] })
              clearTimeout(timer)
            }
          }, 2000)
       } catch (error) {
         msga.edit({ content: `${emoji.get(`alerta`)} | Erro ao gerar o pagamento!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\`` })
       }
   }
}