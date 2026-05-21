const { EmbedBuilder } = require('discord.js');

module.exports = {
  async execute(message, client, db) {
    if (!message.channel.isTextBased()) return;

    // Vérifier si c'est un salon de stalk
    const stalkerChannel = message.guild.channels.cache.find(c => c.name.startsWith('stalker-'));
    if (!stalkerChannel) return;

    const targetId = stalkerChannel.name.replace('stalker-', '');
    const stalkerId = db.stalkers[targetId]?.[message.author.id];

    if (!stalkerId) return;

    // Vérifier si le message contient un bouton
    if (message.attachments.size > 0 || message.embeds.length > 0) {
      const embed = message.embeds[0];
      const mentionButton = embed.components.find(c => c.components.length > 0 && c.components[0].type === 'ButtonComponent');

      if (mentionButton) {
        const buttonId = mentionButton.components[0].id;
        const buttonLabel = mentionButton.components[0].label;

        if (buttonLabel === 'Mentionner') {
          // Vérifier si le bouton est activé/désactivé
          const isActive = mentionButton.components[0].style === 'Success';

          // Notifier le stalker
          const embedReply = new EmbedBuilder()
            .setTitle(`📢 Action Notifiée pour @${targetId}`)
            .setDescription(`Le stalké a ${isActive ? 'activé' : 'désactivé'} les notifications.`)
            .setColor(0x00FF00);

          await stalkerChannel.send({ embeds: [embedReply] });
        }
      }
    }

    // Transférer les messages du stalké
    if (message.author.bot) return;

    const targetUser = message.guild.members.cache.find(m => m.user.id === targetId);
    if (!targetUser) return;

    // Vérifier si le stalké a activé les notifications
    const embed = message.embeds[0];
    const mentionButton = embed.components.find(c => c.components.length > 0 && c.components[0].type === 'ButtonComponent');

    if (mentionButton && mentionButton.components[0].label === 'Mentionner') {
      const isActive = mentionButton.components[0].style === 'Success';
      if (isActive) {
        // Envoyer une mention au stalker
        await stalkerChannel.send(`<@${message.author.id}> a fait : ${message.content}`);
      } else {
        // Envoyer le message normalement
        await stalkerChannel.send(message.content);
      }
    } else {
      await stalkerChannel.send(message.content);
    }
  }
};
