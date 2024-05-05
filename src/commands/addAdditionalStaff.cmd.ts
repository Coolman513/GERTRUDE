import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const AddAdditionalStaffCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { commandName, options, user, member, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  const staff = (options.getMember('member')! as GuildMember).id;
  const abbreviation = options.getString('abbreviation')!.toUpperCase();
  const title = options.getString('title')!;

  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];

  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);
  if (projects[project].owner !== user!.id)
    return fail(`You do not have permission to do that.`, interaction);

  if (projects[project].pnumber != null) {
      for (let pos in projects[project].additionalStaff)
        if (projects[project].additionalStaff[pos].role.abbreviation == abbreviation)
          return fail(`That position already exists.`, interaction);
  }

  db.ref(`/Projects/${guildId}/${project}`).child("additionalStaff").push({
    id: staff,
    role: {
      abbreviation,
      title
    }
  });

  db.ref(`/Projects/${guildId}/${project}`).child("tasks").push({
    abbreviation, done: false
  });

  const embed = new EmbedBuilder()
    .setTitle(`Project Creation`)
    .setDescription(`Added <@${staff}> for position ${abbreviation} for project #${projects[project].pnumber}, \`${projects[project].nickname}\`.`)
    .setColor(0xc58433);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}