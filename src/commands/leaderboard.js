const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription(
      "Show the leaderboard of the top 10 users with the most coins"
    ),
  async execute(interaction) {
    const topUsers = await prisma.user.findMany({
      take: 10, // Die besten 10 Benutzer abrufen
      orderBy: {
        coins: "desc", // Nach Münzen absteigend sortieren
      },
    });

    const leaderboardEmbed = new EmbedBuilder() // Verwende EmbedBuilder
      .setColor(0x0099ff)
      .setTitle("Leaderboard")
      .setDescription("Top 10 Benutzer mit den meisten Coins:");

    topUsers.forEach((user, index) => {
      leaderboardEmbed.addFields({
        name: `${index + 1}. ${user.name}`,
        value: `Coins: ${user.coins}`,
      });
    });

    interaction.reply({ embeds: [leaderboardEmbed] });
  },
};
