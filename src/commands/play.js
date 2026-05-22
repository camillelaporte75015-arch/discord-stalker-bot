module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Faire exécuter une commande au bot'),

    async execute(interaction, client) {
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply('Seul le propriétaire du bot peut utiliser cette commande.');
        }

        const command = interaction.options.getString('command', true);
        const args = interaction.options.getString('args', false) || '';

        // Exemple : faire jouer une musique (à adapter selon vos besoins)
        if (command === 'play') {
            const guild = client.guilds.cache.get(interaction.guildId);
            if (guild) {
                const voiceChannel = guild.channels.cache.find(c => c.name === 'music');
                if (voiceChannel && voiceChannel.isVoiceBased()) {
                    const member = await voiceChannel.join();
                    await member.play(`https://example.com/music.mp3`, { volume: 0.5 });
                    await member.disconnect();
                }
            }
        }

        interaction.reply(`✅ Commande exécutée : ${command} ${args}`);
    }
};
