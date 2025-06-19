const { EmbedBuilder, ModalBuilder, TextInputBuilder, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const { General, emoji } = require("../../DataBaseJson");

module.exports = {
   name: "anunciar",
   description: "[🛠️ | Moderação] Envie um anuncio.",
   
   run: async(client, interaction) => {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você não possui permissão para utilizar esse comando!`, ephemeral: true })
      
      const modal = new ModalBuilder()
       .setCustomId('modalanuncio')
       .setTitle('🎉 | Anunciar')
       
      const text1 = new TextInputBuilder()
       .setCustomId('titulo')
       .setLabel('Titulo:')
       .setPlaceholder('Titulo do anúncio.')
       .setRequired(true)
       .setStyle(1)
       
      const text2 = new TextInputBuilder()
       .setCustomId('desc')
       .setLabel('Descrição:')
       .setPlaceholder('Descrição do anúncio.')
       .setRequired(true)
       .setStyle(2)
       
      const text3 = new TextInputBuilder()
       .setCustomId('content')
       .setLabel('Content: (opcional)')
       .setPlaceholder('Oque ficará fora da Embed.')
       .setRequired(false)
       .setStyle(1)
       
      const text4 = new TextInputBuilder()
       .setCustomId('banner')
       .setLabel('Banner: (opcional)')
       .setPlaceholder('Link da Imagem para o anúncio.')
       .setRequired(false)
       .setStyle(1)
       
      const text5 = new TextInputBuilder()
       .setCustomId('cor')
       .setLabel('Cor: (opcional)')
       .setPlaceholder('Cor da Embed.')
       .setRequired(false)
       .setStyle(1)
       
      modal.addComponents(new ActionRowBuilder().addComponents(text1), new ActionRowBuilder().addComponents(text2), new ActionRowBuilder().addComponents(text3), new ActionRowBuilder().addComponents(text4), new ActionRowBuilder().addComponents(text5))
      
      interaction.showModal(modal)
      
      
      client.on('interactionCreate', async (interaction) => {
        
        if (interaction.isModalSubmit()) {
          
          if (interaction.customId == 'modalanuncio') {
             const titulo = interaction.fields.getTextInputValue("titulo")
             const desc = interaction.fields.getTextInputValue("desc")
             const conten = interaction.fields.getTextInputValue("content")
             const banner = interaction.fields.getTextInputValue("banner")
             const cor = interaction.fields.getTextInputValue("cor") || General.get(`color.padrao`)
             
             if (banner != "") {
               if (!link(banner)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você inseriu um banner inválido!`, ephemeral: true })
             }
             
             if (cor != "") {
               if (!corregex(cor)) return interaction.reply({ content: `${emoji.get(`emojix`)} | Você inseriu uma cor inválida!`, ephemeral: true })
             }
             
             const embedanun = new EmbedBuilder()
              .setTitle(titulo)
              .setDescription(desc)
              .setColor(cor)
              
             if (banner != "") {
               embedanun.setImage(banner)
             }
             
             try {
               await interaction.channel.send({ content: `${conten || ''}`, embeds: [embedanun] })
               
               const msg = await interaction.reply({ content: `${emoji.get(`certo`)} | Anúncio enviado com sucesso!`, ephemeral: true })
             } catch (error) {
               interaction.reply({ content: `${emoji.get(`alerta`)} | Erro ao enviar o anúncio!\n${emoji.get(`emojix`)} | Error: \`${error.message}\``, ephemeral: true })
             }
          }
          
          function link(n) {
              const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
              return urlRegex.test(n)
          }
          function corregex(cor) {
             const corRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/
             return corRegex.test(cor)
          }
        }
      })
   }
}