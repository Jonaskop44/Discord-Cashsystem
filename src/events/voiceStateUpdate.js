const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Ein Objekt, um die Zeiten der Mitglieder im Sprachkanal zu verfolgen
const memberTimes = new Map();

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {GuildMember} member
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   */
  execute: async (oldState, newState) => {
    try {
      let elapsedTime = 0;
      if (newState.channel && newState.member.user.id) {
        const memberId = newState.member.user.id;

        if (!memberTimes.has(memberId)) {
          memberTimes.set(memberId, Date.now());
        }
        const startTime = memberTimes.get(memberId);
        const currentTime = Date.now();
        elapsedTime = (currentTime - startTime) / 1000;
        console.log(elapsedTime, memberTimes);
        const multiplayer = (elapsedTime / 10).toFixed(0);

        if (elapsedTime >= 10) {
          console.log("60 Sekunden", multiplayer);
          const user = await prisma.user.findUnique({
            where: {
              id: memberId,
            },
          });

          if (!user) {
            await prisma.user.create({
              data: {
                id: memberId,
                name: newState.member.user.username,
                messageCount: 0,
                coins: 0,
              },
            });
          }

          await prisma.user.update({
            where: {
              id: memberId,
            },
            data: {
              coins: user.coins + 100 * multiplayer,
            },
          });
          memberTimes.delete(memberId);
        }
      } else {
        const memberId = oldState.member.user.id;
        if (memberTimes.has(memberId)) {
          if (elapsedTime >= 10) {
            console.log("60 Sekunden", multiplayer);
            const user = await prisma.user.findUnique({
              where: {
                id: memberId,
              },
            });
            await prisma.user.update({
              where: {
                id: memberId,
              },
              data: {
                coins: user.coins + 100 * multiplayer,
              },
            });
            memberTimes.delete(memberId);
          }
          console.log(memberTimes);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
