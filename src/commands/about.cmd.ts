
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { VERSION } from "../gert";

export const AboutCmd = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const embed = new EmbedBuilder()
    .setTitle(`GERTRUDE - CMEN Server for rip projects (modified from 9vults nino)`)
    .setDescription(`Version: ${VERSION}\nAuthor: <@773582520809422858>`)
    .setURL(`https://github.com/Coolman513/GERTRUDE`)
    .setColor(0xc58433);
  await interaction.reply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}