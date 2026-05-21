module.exports = {
  async execute(message, args, client, db) {
    if (!args[0]) return message.reply('❌ Utilisez : `!stop`');

    const targetId = message.guild.members.cache.find(m => m.user.id === args[0]?.replace(/^@/, ''));

    if (!targetId) return message.reply('❌ Utilisateur introuvable.');

    // Vérifier si le stalk est actif
    const stalkerId = message.author.id;
    const existingStalk = db.stalkers[targetId.id];

    if (!existingStalk || !existingStalk[stalkerId]) {
      return message.reply('❌ Aucun stalk actif pour cette personne.');
    }

    // Supprimer le salon
    const channel = message.guild.channels.cache.get(existingStalk.channelId);
    if (channel) {
      await channel.delete();
    }

    // Supprimer du stalker
    delete db.stalkers[targetId.id][stalkerId];
    if (Object.keys(db.stalkers[targetId.id]).length === 0) {
      delete db.stalkers[targetId.id];
    }

    // Envoyer un embed de confirmation
    const embed = new EmbedBuilder()
      .setTitle('❌ Stalk Arrêté')
      .setDescription(`Le stalk pour @${targetId.id} a été arrêté.`)
      .setColor(0xFF0000);

    await message.reply({ embeds: [embed] });

    console.log(`✅ Stalk arrêté pour @${targetId.id} par @${stalkerId}`);
  }
};
