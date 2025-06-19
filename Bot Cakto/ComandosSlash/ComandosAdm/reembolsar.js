const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, tema, rankproduto, carrinhos, rank, cupons, rendimentos, saldo } = require("../../DataBaseJson")
const { MercadoPagoConfig, PaymentRefund } = require('mercadopago')

module.exports = {
   name: "reembolsar",
   description: "[🛠|💰 Vendas Moderação] Reembolsa de forma automática um pagamento",
   type: ApplicationCommandType.ChatInput,
   options: [
     {
       name: "id",
       description: "Coloque o ID da compra Aqui!",
       type: ApplicationCommandOptionType.String,
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
       
       const id = interaction.options.getString("id")
       
       if (!carrinhos.has(id)) return interaction.reply({ content: `${emoji.get(`lupa`)} | Compra não encontrada!`, ephemeral: true })
       
       const msg = await interaction.reply({ content: `${emoji.get(`carregando`)} | Reembolsando...` })
       
       const mpLogin = new MercadoPagoConfig({ accessToken: General.get(`paymentauto.access_token`) })
       const mpRefund = new PaymentRefund(mpLogin)
       
       if (carrinhos.get(`${id}.status`) == 'Reembolsado') return msg.edit({ content: `${emoji.get(`emojix`)} | Essa compra já foi reembolsada!`, ephemeral: true })
       
       await mpRefund.create({ payment_id: carrinhos.get(`${id}.idreembolso`) })
       .then(async (resposta) => {
         msg.edit({ content: `${emoji.get(`certo`)} | Reembolso aprovado\n${emoji.get(`lupa`)} | ID do Pagamento: ${id}\n${emoji.get(`preco`)} | Valor Reembolsado: R$${Number(carrinhos.get(`${id}.preco`)).toFixed(2)}` })
         carrinhos.set(`${id}.status`, `Reembolsado`)
       })
       .catch(async (error) => {
         await msg.edit({ content: `${emoji.get(`alerta`)} | Erro realizar o reembolso!\n${emoji.get(`emojix`)} | Mercado Pago Error: \`${error.message}\``, ephemeral: true })
       })
   }
}