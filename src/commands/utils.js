const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

// Fonction pour créer un embed avec bouton
function createMentionToggleEmbed(guildId, targetId, stalkerId) {
    const embed = new EmbedBuilder()
        .setTitle(`👀 Stalk activé pour @${stalkerId}`)
        .setDescription(`Tu stalk maintenant @${stalkerId}\nTout ce que @${stalkerId} fera sera transféré ici.\nSi tu veux être notifié à chaque modification, clique sur le bouton ci-dessous.\nPour arrêter le stalk, utilise **+stop`.`)
        .setColor('#00ff00')
        .setFooter({ text: 'Stalker-Bot', iconURL: guildId ? guildId.members.me.displayAvatarURL() : '' });

    const button = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('mentionToggle')
                .setPlaceholder('Activer/Désactiver les notifications')
                .addOptions([
                    { label: 'Activer', value: 'on' },
                    { label: 'Désactiver', value: 'off' },
                ])
        );

    return { embed, button };
}

// Fonction pour gérer les notifications du bouton
async function handleMentionToggle(client, interaction, channelId, targetId, stalkerId) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) return;

    const row = interaction.message.components.get(0);
    const select = row.components.get(0);
    const value = select.values.get(select.values.first());

    if (value === 'on') {
        // Activer les notifications
        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🔔 Notifications activées')
                    .setDescription(`Tu seras notifié à chaque action de @${stalkerId}.`)
                    .setColor('#00ff00')
            ],
            components: [row]
        });
    } else if (value === 'off') {
        // Désactiver les notifications
        await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🔔 Notifications désactivées')
                    .setDescription(`Tu ne seras plus notifié. Les actions seront envoyées directement.`)
                    .setColor('#ff0000')
            ],
            components: [row]
        });
    }
}
