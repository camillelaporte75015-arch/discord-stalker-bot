const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Fonction pour créer le salon privé
async function createStalkChannel(client, targetId, stalkerId) {
    const guild = client.guilds.cache.get(targetId);
    if (!guild) return false;

    const channelName = `stalker-${stalkerId}`;
    const channel = await guild.channels.create(channelName, {
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.members.me.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: targetId,
                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ],
    });

    return channel;
}

// Commande slash `!stalk @`
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stalk')
        .setDescription('Stalke une personne')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ID ou @ de la personne à stalker')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription('Créer un salon privé')
                .setDefault(true)),

    async execute(interaction, client) {
        const { target, private: createPrivate } = interaction.options;
        const targetId = target.id || target.value.replace('@', '');
        const stalkerId = interaction.user.id;

        // Vérification si la cible est déjà stalkée
        const stalkers = await client.stalkers.get(targetId) || {};
        if (stalkers[stalkerId]) return interaction.reply('Vous êtes déjà un stalker pour cette personne.');

        // Vérification si la cible est en antistalk
        const antistalkList = await client.antistalkList.get(targetId) || [];
        if (antistalkList.includes(stalkerId)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Erreur')
                        .setDescription(`Le propriétaire du bot a empêché le stalk de cette personne. Merci de le contacter @${process.env.OWNER_ID}.`)
                        .setColor('#ff0000')
                ]
            });
        }

        // Vérification du nombre de stalkers max
        const stalkCount = Object.keys(stalkers).length;
        if (stalkCount >= parseInt(process.env.MAX_STALKERS)) {
            return interaction.reply('Vous ne pouvez pas stalker plus de 5 personnes.');
        }

        // Création du salon privé
        let channel;
        if (createPrivate) {
            channel = await createStalkChannel(client, targetId, stalkerId);
            if (!channel) return interaction.reply('Échec de la création du salon.');
        }

        // Envoi de l'embed
        const embed = new EmbedBuilder()
            .setTitle(`👀 Stalk activé pour @${stalkerId}`)
            .setDescription(`Tu stalk maintenant @${stalkerId}\nTout ce que @${stalkerId} fera sera transféré ici.\nSi tu veux être notifié à chaque modification, clique sur le bouton ci-dessous.\nPour arrêter le stalk, utilise **+stop`.`)
            .setColor('#00ff00')
            .setFooter({ text: 'Stalker-Bot', iconURL: client.user.displayAvatarURL() });

        // Ajout du bouton "être mentionné"
        const button = new ActionRow.of(
            new SelectMenuBuilder()
                .setCustomId('mentionToggle')
                .setPlaceholder('Activer/Désactiver les notifications')
                .addOptions([
                    { label: 'Activer', value: 'on' },
                    { label: 'Désactiver', value: 'off' },
                ])
        );

        await interaction.reply({ embeds: [embed], components: [button] });

        // Enregistrement des stalkers
        if (!client.stalkers.has(targetId)) client.stalkers.set(targetId, {});
        client.stalkers.get(targetId)[stalkerId] = true;
        client.stalkers.set(targetId, client.stalkers.get(targetId));

        // Enregistrement dans la liste des antistalk (si nécessaire)
        if (!client.antistalkList.has(targetId)) client.antistalkList.set(targetId, []);
        client.antistalkList.get(targetId).push(stalkerId);
        client.antistalkList.set(targetId, client.antistalkList.get(targetId));
    }
};
