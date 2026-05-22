const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antistalk')
        .setDescription('Empêcher quelqu’un de stalker une personne')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Utilisateur à protéger')
                .setRequired(true)
        ),

    async execute(interaction, client) {

        // owner only
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({
                content: "Seul le propriétaire du bot peut utiliser cette commande.",
                ephemeral: true
            });
        }

        const target = interaction.options.getUser('target');
        const targetId = target.id;

        // init si besoin
        if (!client.antistalkList) client.antistalkList = new Map();

        client.antistalkList.set(targetId, true);

        // DM user
        try {
            await target.send(
                `🚫 Le propriétaire du bot a activé un antistalk sur vous.\nContact: <@${process.env.OWNER_ID}>`
            );
        } catch (e) {
            console.log("Impossible d'envoyer DM");
        }

        return interaction.reply({
            content: `✅ ${target.tag} est maintenant en antistalk.`,
            ephemeral: true
        });
    }
};
