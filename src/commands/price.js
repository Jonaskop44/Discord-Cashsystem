const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  Component,
  ComponentType,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prizes")
    .setDescription("Show the piz"),
  async execute(interaction) {
    const customRole = new ButtonBuilder()
      .setCustomId("customRole")
      .setLabel("Custom role - 500 coins")
      .setStyle(ButtonStyle.Primary);

    const customRolewi = new ButtonBuilder()
      .setCustomId("customRolewi")
      .setLabel("Custom role with icon - 800 coins")
      .setStyle(ButtonStyle.Primary);

    const staffRole = new ButtonBuilder()
      .setCustomId("staffRole")
      .setLabel("Staff role - 1500 coins")
      .setStyle(ButtonStyle.Primary);

    const modRole = new ButtonBuilder()
      .setCustomId("modRole")
      .setLabel("Mod role - 2000 coins")
      .setStyle(ButtonStyle.Primary);

    const nitroBasic = new ButtonBuilder()
      .setCustomId("nitroBasic")
      .setLabel("Nitro basic - 2500 coins")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(
      customRole,
      customRolewi,
      staffRole,
      modRole,
      nitroBasic
    );

    const reply = await interaction.reply({
      content: "Here are the prizes for the products you can buy!",
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      if (interaction.customId === "customRole") {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: interaction.user.id,
            },
          });
          if (user.coins < 500) {
            interaction.followUp({
              content: "You don't have enough coins to buy this product!",
            });
          } else {
            if (interaction.member.roles.cache.has("1169773353125543966")) {
              interaction.followUp({
                content: "Your already have this role!",
              });
            } else {
              interaction.member.roles.add("1169773353125543966");
              interaction.followUp({
                content: "You have successfully bought the custom role!",
              });
              await prisma.user.update({
                where: {
                  id: interaction.user.id,
                },
                data: {
                  coins: user.coins - 500,
                },
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  },
};
