const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  execute: async (member) => {
    try {
      const { id, username } = member.user;
      await prisma.user.create({
        data: {
          id: id,
          name: username,
          messageCount: 0,
          coins: 0,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
