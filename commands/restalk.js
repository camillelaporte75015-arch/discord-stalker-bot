// Ajouter cette fonction à la fin du fichier
module.exports = {
  async restalk(message, args, client, db) {
    if (!args[0]) return message.reply('❌ Utilisez : `!restalk @utilisateur`');

    const targetId = args[0].replace(/^@/, '');
    const targetUser = message.guild.members.cache.find(m => m.user.id === targetId);

    if (!targetUser) return message.reply('❌ Utilisateur introuvable.');

    // Vérifier si l'owner peut restalk
    if (!db.antistalk.includes(targetId)) return message.reply('❌ Cette personne n\'est pas actuellement antistalkée.');

    // Supprimer de la liste antistalk
    db.antistalk = db.antistalk.filter(id => id !== targetId);

    console.log(`✅ @${targetId} retiré de la liste antistalk par @${message.author.id}`);
  }
};
