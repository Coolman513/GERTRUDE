import { ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const DoneCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  const pnum = options.getNumber('pnumber')!;
  const abbreviation = options.getString('abbreviation')!.toUpperCase();

  let epvalue;
  let taskvalue;
  let taskName;
  let isValidUser = false;
  let status = '';
  let pnumDone = true;
  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];

  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);

  for (let staff in projects[project].keyStaff) {
    let staffObj = projects[project].keyStaff[staff];
    if (staffObj.role.abbreviation === abbreviation && (staffObj.id === user.id || projects[project].owner === user.id)) {
      isValidUser = true;
      taskName = staffObj.role.title;
      status = `✅ **${staffObj.role.title}**\n`;
    }
  }

  for (let ep in projects[project].pnumber) {
    if (projects[project].pnumber[ep].number == pnum) {
      epvalue = ep;
      for (let task in projects[project].pnumber[ep].tasks) {
        let taskObj = projects[project].pnumber[ep].tasks[task];
        if (taskObj.abbreviation === abbreviation) {
          taskvalue = task;
          if (taskObj.done)
            return fail(`Task ${abbreviation} is already done!`, interaction);
        }
        else if (!taskObj.done) pnumDone = false;
        // Status string
        if (taskObj.abbreviation === abbreviation) status += `__~~${abbreviation}~~__ `;
        else if (taskObj.done) status += `~~${taskObj.abbreviation}~~ `;
        else status += `**${taskObj.abbreviation}** `;
      }
      if (taskvalue == undefined) return fail(`Task ${abbreviation} does not exist!`, interaction);
      if (!isValidUser) { // Not key staff
        for (let addStaff in projects[project].pnumber[ep].additionalStaff) {
          let addStaffObj = projects[project].pnumber[ep].additionalStaff[addStaff];
          if (addStaffObj.role.abbreviation === abbreviation && (addStaffObj.id === user.id || projects[project].owner === user.id)) {
            status = `✅ **${addStaffObj.role.title}**\n` + status;
            taskName = addStaffObj.role.title;
            isValidUser = true;
          }
        }
      }
    }
  }

  if (!isValidUser)
    return fail('You do not have permission to do that.', interaction);
  if (taskvalue != undefined)
    db.ref(`/Projects/${guildId}/${project}/pnumber/${epvalue}/tasks/${taskvalue}`).update({
      abbreviation, done: true
    });

  const pnumDoneText = pnumDone ? `\nAlso, pnum ${pnum} is now complete!` : '';
  const replyEmbed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle('✅ Task Complete')
    .setDescription(`Nice job getting the **${taskName}** for pnum ${pnum} done.${pnumDoneText}`)
    .setColor(0xd797ff)
    .setTimestamp(Date.now());
  await interaction.editReply({ embeds: [replyEmbed], allowedMentions: generateAllowedMentions([[], []]) });

  if (pnumDone) {
    db.ref(`/Projects/${guildId}/${project}/pnumber/${epvalue}`).update({ done: true });
  }

  const publishEmbed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle(`pnum ${pnum}`)
    .setThumbnail(projects[project].poster)
    .setDescription(status)
    .setTimestamp(Date.now());
  const publishChannel = client.channels.cache.get(projects[project].updateChannel);
  if (publishChannel?.isTextBased)
    (publishChannel as TextChannel).send({ embeds: [publishEmbed] })
}