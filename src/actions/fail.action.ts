import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { generateAllowedMentions } from "./generateAllowedMentions.action";

export const fail = async (faildesc: string, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const embed = new EmbedBuilder()
    .setTitle(`Apologies, Master, but that is not allowed.`)
    .setDescription(faildesc)
    .setColor(0xc58433);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
  return;
}