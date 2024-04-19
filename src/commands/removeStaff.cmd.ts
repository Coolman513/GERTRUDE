import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const RemoveStaffCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  const abbreviation = options.getString('abbreviation')!.toUpperCase();

  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];

  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);
  if (projects[project].owner !== user!.id)
    return fail(`You do not have permission to do that.`, interaction);

  let success = false;
  for (let pos in projects[project].keyStaff)
    if (projects[project].keyStaff[pos].role.abbreviation == abbreviation) {
      success = true;
      db.ref(`/Projects/${guildId}/${project}`).child("keyStaff").child(pos).remove();
    }

if (!success)
  return fail(`Task ${abbreviation} was not found.`, interaction);


  const pnumber = projects[project].pnumber;
  for (let key in pnumber) {
    for (let task in pnumber[key].tasks) {
      if (pnumber[key].tasks[task].abbreviation == abbreviation)
        db.ref(`/Projects/${guildId}/${project}/pnumber/${key}/tasks`).child(task).remove();
    }
  }

  const embed = new EmbedBuilder()
    .setTitle(`Project Modification`)
    .setDescription(`Removed position ${abbreviation} from the project.`)
    .setColor(0xd797ff);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}
