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
    try {
      const topUsers = await prisma.user.findMany({
        take: 10,
        orderBy: {
          coins: "desc",
        },
      });

      const leaderboardEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Leaderboard")
        .setDescription("Top 10 users with the most coins:");

      topUsers.forEach((user, index) => {
        leaderboardEmbed.addFields({
          name: `${index + 1}. ${user.name}`,
          value: `Coins: ${user.coins}`,
        });
      });

      interaction.reply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
