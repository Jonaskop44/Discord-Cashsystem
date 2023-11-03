const { SlashCommandBuilder } = require("@discordjs/builders");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money")
    .setDescription("Shows the amount of money you have"),
  async execute(interaction) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: interaction.user.id,
        },
      });

      if (!user) {
        return interaction.reply("You don't have any money yet!");
      }

      interaction.reply(`You have ${user.coins} coins!`);
    } catch (error) {
      console.log(error);
    }
  },
};
