const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  execute: async (member) => {
    await prisma.user.create({
      data: {
        id: member.id,
        name: member.username,
        messageCount: 0,
        coins: 0,
      },
    });
  },
};
