import { ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const UndoneWScansCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  let abbreviation: String | null = options.getString('abbreviation')!.toUpperCase();

  let taskvalue;
  let taskName;
  let isValidUser = false;
  let status = '';
  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];

  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);

  for (let staff in projects[project].scans) {
    let sstaffObj = projects[project].scans[staff];
    if (sstaffObj.abbreviation === abbreviation && (sstaffObj.id === user.id || projects[project].owner === user.id)) {
      isValidUser = true;
      taskName = sstaffObj.title;
      status = `❌ **${sstaffObj.title}**\n`;
    }
  }


  if (projects[project].pnumber != null) {
      for (let scan in projects[project].scans) {
        let scanObj = projects[project].scans[scan];
        if (scanObj.abbreviation === abbreviation) {
          taskvalue = scan;
          if (!scanObj.done)
            return fail(`Scan ${abbreviation} is not done.`, interaction);
        }
        // Status string
        if (scanObj.abbreviation === abbreviation) status += `__${abbreviation}__ `;
        else if (scanObj.done) status += `~~${scanObj.abbreviation}~~ `;
        else status += `**${scanObj.abbreviation}** `;
      }
      if (taskvalue == undefined) return fail(`Scan ${abbreviation} does not exist!`, interaction);
      if (!isValidUser) { // Not key staff
        for (let addStaff in projects[project].additionalStaff) {
          let addStaffObj = projects[project].additionalStaff[addStaff];
          if (addStaffObj.role.abbreviation === abbreviation && (addStaffObj.id === user.id || projects[project].owner === user.id)) {
            status = `❌ **${addStaffObj.role.title}**\n` + status;
            taskName = addStaffObj.role.title;
            isValidUser = true;
          }
        }
      }
    }

  if (!isValidUser)
    return fail('You do not have permission to do that.', interaction);

  if (taskvalue != undefined)
    db.ref(`/Projects/${guildId}/${project}/scans/${taskvalue}`).update({
      abbreviation, done: false
    });

  db.ref(`/Projects/${guildId}/${project}`).update({ scansDone: false });

  const embed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle('❌ Task Incomplete')
    .setDescription(`So looks like project #${projects[project].pnumber}, \`${projects[project].nickname}\`'s **${taskName}** scan wasn't done. Take your time, don't rush it.`)
    .setColor(0xc58433)
    .setTimestamp(Date.now());
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });

  const publishEmbed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle(`Scans Cleaned`)
    .setThumbnail(projects[project].poster)
    .setDescription(`${status}`)
    .setColor(Number(projects[project].color))
    .setTimestamp(Date.now());
  const publishChannel = client.channels.cache.get(projects[project].updateChannel);
  if (publishChannel?.isTextBased)
    (publishChannel as TextChannel).send({ embeds: [publishEmbed] })
}