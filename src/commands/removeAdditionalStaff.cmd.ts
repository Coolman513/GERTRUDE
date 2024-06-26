
import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const RemoveAdditionalStaffCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { commandName, options, user, member, guildId } = interaction;

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
    if (projects[project].pnumber != null) {
      for (let pos in projects[project].additionalStaff){
        if (projects[project].additionalStaff[pos].role.abbreviation == abbreviation) {
            success = true;
            db.ref(`/Projects/${guildId}/${project}/additionalStaff`).child(pos).remove();
          }
        }
        if (success) {
          for (let task in projects[project].tasks) {
            if (projects[project].tasks[task].abbreviation == abbreviation)
              db.ref(`/Projects/${guildId}/${project}/tasks`).child(task).remove();
          }
        }
      }
  if (!success)
    return fail(`Task ${abbreviation} was not found.`, interaction);

  const embed = new EmbedBuilder()
    .setTitle(`Project Modification`)
    .setDescription(`Removed position ${abbreviation} for Project #${projects[project].pnumber}, \`${projects[project].nickname}\`.`)
    .setColor(0xc58433);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}