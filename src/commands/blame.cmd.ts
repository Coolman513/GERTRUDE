
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
  let pnumber = options.getNumber('pnumber');

  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];
  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);
  
  let status = '';
  let success = false;

  let projObj = projects[project];
    if ((pnumber != null && projObj.pnumber === pnumber) || (pnumber == null)) {
      success = true;
      for (let task in projects[project].tasks) {
        let taskObj = projects[project].tasks[task];
        if (taskObj.done) status += `~~${taskObj.abbreviation}~~ `;
        else status += `**${taskObj.abbreviation}** `;
      }
    }

  const embed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle(`Project #${projects[project].pnumber}`)
    .setThumbnail(projects[project].poster)
    .setDescription(`${status} \n Artist: ${projects[project].artist} \n Media: ${projects[project].type} \n Number of Tracks: ${projects[project].length}`)
    .setColor(Number(projects[project].color))
    .setTimestamp(Date.now());
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });

}