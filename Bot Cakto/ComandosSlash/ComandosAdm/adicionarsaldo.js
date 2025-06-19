const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, ComponentType } = require("discord.js")
const { perms, General, emoji, saldo } = require("../../DataBaseJson")
const { MercadoPagoConfig, Payment } = require('mercadopago')
const axios = require('axios')

module.exports = {
   name: "adicionarsaldo",
   description: "[💰| Vendas] Adicionar saldo via Pix",
   type: ApplicationCommandType.ChatInput,
   options: [
      {
        name: "valor",
        description: "Valor que deseja adicionar.",
        type: ApplicationCommandOptionType.Number,
        required: true
      }
   ],
   
   run: async(client, interaction) => {
       if (!General.get(`paymentauto.access_token`).includes("APP_USR")) return interaction.reply({ content: `${emoji.get(`alerta`)} | Função apenas com mercado pago.`, ephemeral: true })
       
       if (General.get(`saldo.saldo`) == 'OFF') return interaction.reply({ content: `${emoji.get(`emojix`)} | O sistema de saldo está desativado.`, ephemeral: true })
       
       const valor = interaction.options.getNumber("valor")
       
       if (valor < Number(General.get(`saldo.minimo`))) return interaction.reply({ content: `ERROR: Está função foi definida para ter um VALOR MÍNIMO de ${General.get(`saldo.minimo`)}`, ephemeral: true })
       
       const msga = await interaction.reply({ content: `${emoji.get(`carregando`)} | Gerando pagamento...`, ephemeral: true })
       
       const soma = (valor * Number(General.get(`saldo.bonus`))) / 100
       
       const valorBonus = (parseFloat(Number(valor) + Number(soma)).toFixed(2))
       
       const timer = setTimeout(() => {
          interaction.editReply({ content: `${emoji.get(`lupa`)} **| O Tempo para fazer o pagamento acabou!**`, embeds: [], components: [] })
       }, General.get(`paymentauto.tempopagar`) * 60 * 1000)
       
       const mpLogin = new MercadoPagoConfig({ accessToken: General.get(`paymentauto.access_token`) })
       const payment = new Payment(mpLogin)
       
       const payment_data = {
         transaction_amount: valor,
         description: `Adicionar saldo - ${interaction.user.username}`,
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
           .setDescription(`\`\`\`Pague com Pix para receber seu Saldo.\`\`\`\n${emoji.get(`preco`)} **| Valor:**\nR$${valor.toFixed(2)}\n${emoji.get(`sorteio`)} | Bônus de depósito:\n${General.get(`saldo.bonus`)}% - ${General.get(`saldo.bonus`) == "0" ? "0.00" : valorBonus}\n${emoji.get(`lupa`)} | Pagamento expira em:\n<t:${time}:f> (<t:${time}:R>)`)
           .setColor(General.get(`color.padrao`))
           .setFooter({ text: `Após efetuar o pagamento, o tempo do saldo chegar na sua conta é de no máximo 1 minuto!`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
           
          msga.edit({ content: ``, embeds: [embed], components: [row] }).then(msg => {
          
           const filter = i => i.member.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter });
            collector.on('collect', interaction2 => {
             
             if (interaction2.customId == 'cpcpix') {
                interaction2.reply({ content: `${data.point_of_interaction.transaction_data.qr_code}`, ephemeral: true })
             }
             
             if (interaction2.customId == 'qrcpix') {
                interaction2.reply({ files: [attachment], ephemeral: true })
             }
             
             if (interaction2.customId == 'cancelaarpix') {
                clearTimeout(timer)
                interaction2.update({ content: `${emoji.get(`lupa`)} | Pagamento cancelado!`, embeds: [], components: [], ephemeral: true })
             }
          })
          })
          
          const checkPaymentStatus = setInterval(async () => {
            const infoPayment = await payment.get({ id: data.id })
            
            if (infoPayment.status == "approved") {
              clearInterval(checkPaymentStatus);
              interaction.editReply({ content: `${emoji.get(`certo`)} | Pagamento aprovado com sucesso!`, embeds: [], components: [] })
              
              if (Number(General.get(`saldo.bonus`)) != 0) {
                saldo.add(interaction.user.id, valorBonus)
              } else {
                saldo.add(interaction.user.id, valor)
              }
              
              clearTimeout(timer)
            }
          }, 2000)
       } catch (error) {
          msga.edit({ content: `${emoji.get(`alerta`)} | Erro ao gerar o pagamento!\n${emoji.get(`emojix`)} | Error: \`${error.code} ${error.message}\`` })
       }
   }
}