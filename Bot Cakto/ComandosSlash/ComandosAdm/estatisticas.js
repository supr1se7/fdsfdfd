const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js")
const { perms, General, emoji, produto, rendimentos } = require("../../DataBaseJson")
const moment = require('moment')

module.exports = {
   name: "estatisticas",
   description: "[🛠️|💰 Vendas Moderação] Veja as estatísticas de vendas do bot.",
   run: async(client, interaction) => {
      if (!perms.has(interaction.user.id)) return interaction.reply({
         embeds: [new EmbedBuilder()
           .setDescription(`${emoji.get(`alerta`)} | Você não possui permissão para utilizar este comando!`)
           .setColor("Red")
         ],
         ephemeral: true 
       })
       
      const hojepedidos = rendimentos.get(`${moment().format('L')}.pedidos`)  || 0;
      const hojerecebimentos = rendimentos.get(`${moment().format('L')}.recebimentos`) || 0;
       
       var setedias = 0;
       setedias = Number(setedias) + Number(hojepedidos);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(1, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(2, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(3, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(4, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(5, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(6, 'days').format('L')}.pedidos`) || 0);
       setedias = Number(setedias) + Number(rendimentos.get(`${moment().subtract(7, 'days').format('L')}.pedidos`) || 0);

      var setediasrec = 0;
       setediasrec = Number(setediasrec) + Number(hojerecebimentos);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(1, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(2, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(3, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(4, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(5, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(6, 'days').format('L')}.recebimentos`) || 0);
       setediasrec = Number(setediasrec) + Number(rendimentos.get(`${moment().subtract(7, 'days').format('L')}.recebimentos`) || 0);

      var setedias2 = 0;
       setedias2 = Number(setedias2) + Number(hojepedidos);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(1, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(2, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(3, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(4, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(5, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(6, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(7, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(8, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(9, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(10, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(11, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(12, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(13, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(14, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(15, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(16, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(17, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(18, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(19, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(20, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(21, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(22, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(23, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(24, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(25, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(26, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(27, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(28, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(29, 'days').format('L')}.pedidos`) || 0);
       setedias2 = Number(setedias2) + Number(rendimentos.get(`${moment().subtract(30, 'days').format('L')}.pedidos`) || 0);

      var setediasrec2 = 0;
       setediasrec2 = Number(setediasrec2) + Number(hojerecebimentos);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(1, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(2, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(3, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(4, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(5, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(6, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(7, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(8, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(9, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(10, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(11, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(12, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(13, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(14, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(15, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(16, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(17, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(18, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(19, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(20, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(21, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(22, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(23, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(24, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(25, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(26, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(27, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(28, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(29, 'days').format('L')}.recebimentos`) || 0);
       setediasrec2 = Number(setediasrec2) + Number(rendimentos.get(`${moment().subtract(30, 'days').format('L')}.recebimentos`) || 0);
       
       let pedidos2 = 0
       const totalpedidos = rendimentos.all().filter(x => x.data.pedidos).forEach(x => {
         pedidos2 += x.data.pedidos
       })
       let recebidototal = 0
       const totalrendimentos = rendimentos.all().filter(x => x.data.recebimentos).forEach(x => {
         recebidototal += x.data.recebimentos
       })
       
       const embed = new EmbedBuilder()
        .setTitle(`${emoji.get(`estrela2`)} | Seus rendimentos durante:`)
        .addFields(
          { name: `${emoji.get(`raio`)} | Hoje:`, value: `${emoji.get(`diamante`)} | Pedidos: \`${hojepedidos || "0"}\`\n${emoji.get(`estrela2`)} | Recebimentos: \`R$${Number(hojerecebimentos).toFixed(2)}\`` },
          { name: `${emoji.get(`raio`)} | Últimos 7 dias:`, value: `${emoji.get(`diamante`)} | Pedidos: \`${setedias || "0"}\`\n${emoji.get(`estrela2`)} | Recebimentos: \`R$${Number(setediasrec).toFixed(2)}\`` },
          { name: `${emoji.get(`raio`)} | Últimos 30 dias:`, value: `${emoji.get(`diamante`)} | Pedidos: \`${setedias || "0"}\`\n${emoji.get(`estrela2`)} | Recebimentos: \`R$${Number(setediasrec2).toFixed(2)}\`` },
          { name: `${emoji.get(`link`)} | Todo Periodo`, value: `${emoji.get(`coroa`)} **| Pedidos:** \`${pedidos2}\`\n${emoji.get(`urso`)} | **Recebimentos:** \`R$${Number(recebidototal).toFixed(2)}\`` },
        )
        .setColor(General.get(`color.padrao`))
        
       interaction.reply({ embeds: [embed] })
   }
}