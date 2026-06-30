import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { diceGenerator } from "@/components";
import { SlashCommand } from "@/types";

function dice(): SlashCommand {
  const data = new SlashCommandBuilder()
    .setName("dice")
    .setDescription("/dice nbr of faces [nbr of dice]")
    .addIntegerOption((option) =>
      option
        .setName("nbr_of_faces")
        .setDescription("Number of faces of the dice [max 999]")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("nbr_of_dice")
        .setDescription("Number of dice to roll [max 100]")
        .setRequired(true)
    );

  async function execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const nbrOfFaces = interaction.options.getInteger("nbr_of_faces", true);
    const nbrOfDice = interaction.options.getInteger("nbr_of_dice") || 1;

    if (nbrOfDice > 100) {
      await interaction.reply("Man you abuse it's 100 dices max !! :(");
      return;
    }
    if (nbrOfFaces > 999) {
      await interaction.reply("Man you abuse it's 999 faces max !! :(");
      return;
    }
    if (nbrOfFaces < 1 || nbrOfDice < 1) {
      await interaction.reply("I can't roll this type of dices !! :(");
      return;
    }

    const result = diceGenerator(nbrOfFaces, nbrOfDice);

    const reply =
      result.length === 1
        ? trolling(result)
        : `Les résultats des dés sont ${result.join(", ")} !`;

    await interaction.reply(reply);
  }

  return { data: data as SlashCommandBuilder, execute };
}

function trolling(result: number[]): string {
  const rdm = diceGenerator(2, 1)[0]; // juste la valeur au lieu du tableau
  switch (result[0]) {
    case 1:
      return rdm === 1
        ? `J'espère que tu es prêt à échouer car tu as eu un ${result[0]} !`
        : `Et c'est un échec critique pour le joueur français : ${result[0]} !`;
    case 20:
      return rdm === 2
        ? `Regardez-moi ce magnifique bg qui fait un ${result[0]} exceptionnel !`
        : `Full luck, le mec lâche un ${result[0]} tranquille !`;
    default:
      return `Le résultat du dé est ${result[0]} !`;
  }
}

export default dice();
