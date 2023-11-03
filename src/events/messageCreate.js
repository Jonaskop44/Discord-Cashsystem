const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {GuildMember} member
   */
  execute: async (message) => {
    if (!message.author.bot) {
      try {
        const userID = message.author.id;
        const user = await prisma.user.findUnique({
          where: {
            id: userID,
          },
        });

        if (!user) {
          await prisma.user.create({
            data: {
              id: userID,
              name: message.author.username,
              messageCount: 0,
              voiceCount: 0,
              coins: 0,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              id: userID,
            },
            data: {
              messageCount: user.messageCount + 1,
            },
          });
        }

        if (user.messageCount === 50) {
          await prisma.user.update({
            where: {
              id: userID,
            },
            data: {
              coins: user.coins + 20,
              messageCount: 0,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
};
