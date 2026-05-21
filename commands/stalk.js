const { EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  async execute(message, args, client, db) {
    if (!args[0]) return message.reply('❌ Utilisez : `!stalk @utilisateur`');

    const targetId = args[0].replace(/^@/, '');
    const targetUser = message.guild.members.cache.find(m => m.user.id === targetId);

    if (!targetUser) return message.reply('❌ Utilisateur introuvable.');

    // Vérifier si le stalk est déjà actif
    const stalkerId = message.author.id;
    const existingStalk = db.stalkers[targetId];

    if (existingStalk && existingStalk[stalkerId]) {
      return message.reply('❌ Vous êtes déjà en stalk pour cette personne.');
    }

    // Vérifier si le cible est en antistalk
    const isAntistalk = db.antistalk.includes(targetId);
    if (isAntistalk) {
      return message.reply(`❌ Le propriétaire a interdit le stalk pour cette personne. Contactez @${message.author.tag} pour plus d'informations.`);
    }

    // Créer le salon privé
    const channel = await message.guild.createTextChannel(`stalker-${targetId}`);
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('👀 Stalk Actif')
          .setDescription(`Tu es maintenant en stalk pour @${targetId} (stalké par @${stalkerId})`)
          .setColor(0xFF0000)
          .addFields(
            { name: '📢 Notifications', value: 'Cliquez sur le bouton ci-dessous pour être notifié des actions.', inline: true },
            { name: '🔄 Stoppable', value: 'Utilise `!stop` pour arrêter le stalk.', inline: true }
          )
          .setFooter({ text: 'Stalker : @' + stalkerId })
      ]
    });

    // Ajouter le bot au salon
    await channel.inviteCodes.forEach(code => {
      if (code.bot) return;
      channel.inviteCodes.delete(code);
    });

    // Enregistrer le stalk dans la base de données
    if (!db.stalkers[targetId]) db.stalkers[targetId] = {};
    db.stalkers[targetId][stalkerId] = {
      channelId: channel.id,
      mention: `<@${stalkerId}>`
    };

    // Envoyer un embed au stalker
    const embed = new EmbedBuilder()
      .setTitle(`👁️ Stalk Actif pour @${targetId}`)
      .setDescription(`Tu as commencé à stalker @${targetId}. Tout ce qu'il/elle fait sera transféré ici.`)
      .setColor(0x00FF00)
      .addFields(
        { name: '📢 Notifications', value: 'Cliquez sur le bouton ci-dessous pour être notifié.', inline: true },
        { name: '🚫 Arrêter', value: 'Utilise `!stop` pour arrêter.', inline: true }
      )
      .setFooter({ text: 'Stalké par : @' + stalkerId });

    await message.reply({ embeds: [embed] });

    console.log(`✅ Stalk activé pour @${targetId} par @${stalkerId}`);
  }
};
