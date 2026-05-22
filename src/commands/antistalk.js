module.exports = {
    data: new SlashCommandBuilder()
        .setName('antistalk')
        .setDescription('Empêcher quelqu’un de stalker une personne')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('ID ou @ de la personne à protéger')
                .setRequired(true)),

    async execute(interaction, client) {
        const { target } = interaction.options;
        const targetId = target.id || target.value.replace('@', '');

        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply('Seul le propriétaire du bot peut utiliser cette commande.');
        }

        // Ajout à la liste antistalk
        if (!client.antistalkList.has(targetId)) client.antistalkList.set(targetId, []);
        client.antistalkList.get(targetId).push(interaction.user.id);
        client.antistalkList.set(targetId, client.antistalkList.get(targetId));

        // Notifier la personne
        const guild = client.guilds.cache.get(targetId);
        if (guild) {
            const member = await guild.members.fetch(targetId);
            if (member) {
                await member.send({
                    content: `Le propriétaire du bot a empêché le stalk de cette personne. Merci de le contacter @${process.env.OWNER_ID}.`,
                    allowedMentions: { parse: ['everyone'] }
                });
            }
        }

        interaction.reply(`✅ @${targetId} est maintenant en antistalk.`);
    }
};
