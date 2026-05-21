const db = require('../database');

module.exports = {
  async execute(message, args, client, db) {
    if (!args[0]) return message.reply('❌ Utilisez : `!antistalk @utilisateur`');

    const targetId = args[0].replace(/^@/, '');
    const targetUser = message.guild.members.cache.find(m => m.user.id === targetId);

    if (!targetUser) return message.reply('❌ Utilisateur introuvable.');

    // Vérifier si le stalk est déjà actif
    const stalkerId = message.author.id;
    const existingStalk = db.stalkers[targetId];

    if (!existingStalk) return message.reply('❌ Aucun stalk actif pour cette personne.');

    // Vérifier si l'owner peut antistalk
    if (!db.antistalk.includes(stalkerId)) {
      return message.reply('❌ Vous n\'êtes pas autorisé à antistalker.');
    }

    // Ajouter à la liste antistalk
    db.antistalk.push(targetId);
    db.antistalk = [...new Set(db.antistalk)]; // Supprimer les doublons

    // Envoyer un embed au stalker
    const embed = new EmbedBuilder()
      .setTitle('❌ Stalk Interdit')
      .setDescription(`Le propriétaire a interdit le stalk pour @${targetId}. Contactez @${message.author.tag} pour plus d'informations.`)
      .setColor(0xFF0000);

    await message.reply({ embeds: [embed] });

    console.log(`✅ @${targetId} ajouté à la liste antistalk par @${stalkerId}`);
  }
};
