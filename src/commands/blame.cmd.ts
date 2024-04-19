
import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const BlameCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  let pnum: number | null = options.getNumber('pnumber');

  let epvalue;
  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];
  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);
  let status = '';
  let success = false;
  for (let ep in projects[project].pnumber) {
    let projObj = projects[project].pnumber[ep];
    if ((pnum != null && projObj.number === pnum) || (pnum == null && projObj.done == false)) {
      success = true;
      pnum = projObj.number;
      for (let task in projects[project].pnumber[ep].tasks) {
        let taskObj = projects[project].pnumber[ep].tasks[task];
        if (taskObj.done) status += `~~${taskObj.abbreviation}~~ `;
        else status += `**${taskObj.abbreviation}** `;
      }
    }
  }

  if (!success)
    return fail('The project is complete, or the specified pnum could not be found.', interaction);

  const embed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle(`Project Number ${pnum}`)
    .setThumbnail(projects[project].poster)
    .setDescription(status)
    .setColor(0xd797ff)
    .setTimestamp(Date.now());
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });

}