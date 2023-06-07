const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check Latency.'),
    async execute(interaction){
        const timeTaken = Date.now() - interaction.createdTimestamp;
        return interaction.reply(`Act cool! Mất ${timeTaken}ms để hết đứng hình.`);
    }
};