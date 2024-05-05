
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { helpText } from "../misc/misc";

export const HelpCmd = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const embed = new EmbedBuilder()
    .setTitle(`GERTRUDE Help`)
    .setDescription(helpText)
    .setColor(0xc58433);

  await interaction.reply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}