module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        // Vérification si le message est dans un salon stalk
        if (!message.channel.name.startsWith('stalker-')) return;

        const targetId = message.channel.name.replace('stalker-', '');
        const stalkers = client.stalkers.get(targetId) || {};

        // Vérification si le message vient d'une cible stalkée
        if (stalkers[message.author.id]) {
            // Envoi du message à tous les stalkers
            const embed = new EmbedBuilder()
                .setTitle(`📢 Action détectée de @${message.author.id}`)
                .setDescription(`@${message.author.tag} a fait : ${message.content}`)
                .setColor('#00ff00');

            const channel = message.channel;
            const messages = await channel.messages.fetch({ limit: 10 });

            // Envoi de l'embed à tous les stalkers
            for (const [stalkerId, _] of Object.entries(stalkers)) {
                const guild = client.guilds.cache.get(targetId);
                if (guild) {
                    const member = await guild.members.fetch(stalkerId);
                    if (member) {
                        await member.send({
                            embeds: [embed],
                            allowedMentions: { parse: ['everyone'] }
                        });
                    }
                }
            }
        }
    }
};
