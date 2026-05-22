module.exports = {
    name: 'guildJoin',
    async execute(client, guild) {
        // Vérification si le salon existe déjà
        const existingChannel = guild.channels.cache.find(c => c.name.startsWith('stalker-'));
        if (existingChannel) return;

        // Création du salon privé (à adapter selon vos besoins)
        const channel = await guild.channels.create('stalker-' + guild.id, {
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.members.me.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });

        // Envoi d'un message de bienvenue
        await channel.send({
            content: 'Ce salon est réservé aux stalkers. Utilisez la commande `!stalk @` pour rejoindre.',
            allowedMentions: { parse: [] }
        });
    }
};
