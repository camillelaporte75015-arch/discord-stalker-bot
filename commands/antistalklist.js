// Ajouter cette fonction à la fin du fichier
module.exports = {
  async list(message, client, db) {
    if (!db.antistalk.length) return message.reply('❌ Aucune personne antistalkée actuellement.');

    const embed = new EmbedBuilder()
      .setTitle('🚫 Liste des Personnes Antistalkées')
      .setDescription('Voici les utilisateurs pour lesquels le stalk est interdit :')
      .setColor(0xFF0000);

    db.antistalk.forEach(userId => {
      const user = message.guild.members.cache.find(m => m.user.id === userId);
      embed.addFields({ name: `<@${userId}>`, value: user.tag || user.id });
    });

    await message.reply({ embeds: [embed] });
  }
};
