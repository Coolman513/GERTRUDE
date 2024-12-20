import { ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel} from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData } from "../misc/types";
import { Database } from "@firebase/database-types";
import { fail } from "../actions/fail.action";

export const BatchDoneWScansCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, guildId } = interaction;

  await interaction.deferReply();

  const project = options.getString('project')!;
  
  let taskvalue;
  let taskName;
  let isValidUser = false;
  let status = '';
  let scanDone = true;
  if (guildId == null || !(guildId in dbdata.guilds))
    return fail(`Guild ${guildId} does not exist.`, interaction);

  let projects = dbdata.guilds[guildId];

  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);

  for (let staff in projects[project].scans) {
    let sstaffObj = projects[project].scans[staff];
    if (sstaffObj.id === user.id || projects[project].owner === user.id) {
      isValidUser = true;
      taskName = sstaffObj.title;
      status = `✅ **${sstaffObj.title}**\n`;
    }
  }

  if (projects[project].pnumber != null) {
      for (let scan in projects[project].scans) {
        let scanObj = projects[project].scans[scan];
        taskvalue = scan;
        if (taskvalue != undefined){
            db.ref(`/Projects/${guildId}/${project}/scans/${taskvalue}`).update({
              done: true
            });

            if (scanObj.done) status += `~~${scanObj.abbreviation}~~ `;
            else status += `**${scanObj.abbreviation}** `;
        }

      if (!isValidUser) { // Not key staff
        for (let addStaff in projects[project].additionalStaff) {
          let addStaffObj = projects[project].additionalStaff[addStaff];
          if (addStaffObj.id === user.id || projects[project].owner === user.id) {
            status = `✅ **${addStaffObj.role.title}**\n` + status;
            taskName = addStaffObj.role.title;
            isValidUser = true;
          }
        }
      }
    }

  if (!isValidUser)
    return fail('You do not have permission to do that.', interaction);
  

  const scanDoneText = scanDone ? `\nAlso, all scans are now complete!` : '';
  const replyEmbed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle('✅ Task Complete')
    .setDescription(`Nice job getting the scans done for Project #${projects[project].pnumber}, \`${projects[project].nickname}\`.${scanDoneText}`)
    .setColor(0xc58433)
    .setTimestamp(Date.now());
  await interaction.editReply({ embeds: [replyEmbed], allowedMentions: generateAllowedMentions([[], []]) });

  if (scanDone) {
    db.ref(`/Projects/${guildId}/${project}`).update({ scansDone: true });
  }


  const publishEmbed = new EmbedBuilder()
    .setAuthor({ name: projects[project].title })
    .setTitle(`Scans Cleaned`)
    .setThumbnail(projects[project].poster)
    .setDescription(status)
    .setColor(Number(projects[project].color))
    .setTimestamp(Date.now());
  const publishChannel = client.channels.cache.get(projects[project].updateChannel);
  if (publishChannel?.isTextBased)
    (publishChannel as TextChannel).send({ embeds: [publishEmbed] })
}
}
