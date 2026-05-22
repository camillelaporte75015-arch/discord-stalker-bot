module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Faire dire quelque chose au bot'),

    async execute(interaction, client) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply('Seul le propriétaire du bot peut utiliser cette commande.');
        }

        const text = interaction.options.getString('text', true);
        const message = await interaction.reply({ content: text });
        await message.delete();

        interaction.reply(`✅ Le bot a dit : ${text}`);
    }
};
