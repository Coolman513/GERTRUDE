import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData, Project } from "../misc/types";
import { fail } from "../actions/fail.action";
import { Database } from "@firebase/database-types";

export const EditProjectCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, member, guildId } = interaction;
  if (guildId == null) return;

  await interaction.deferReply();

  const project = options.getString('project')!;
  const option = options.getString('option')!;
  const newValue = options.getString('newvalue')!;

  let projects = dbdata.guilds[guildId];
  if (!(project in projects))
    return fail(`Project ${project} does not exist.`, interaction);
  if (projects[project].owner !== user!.id)
    return fail(`You do not have permission to do that.`, interaction);

  const ref = db.ref(`/Projects/`).child(`${guildId}`).child(`${project}`);

  switch (option) {
    case 'Pnumber':
      let pnumber = Number(newValue) || -1;
      if (pnumber === -1 || isNaN(Number(pnumber))) return fail('Input must be a number', interaction);
      ref.update({ pnumber: newValue });
      break;
    case 'Color':
      if (!newValue.includes('0x')) return fail('Input must be a hex color and also include the prefix "0x"', interaction);
      ref.update({ color: newValue });
      break;
    case 'Type':
      if (!(['Vinyl', 'Cassette', 'CD', 'SACD', 'BD']).includes(newValue)) return fail('Input must be a one of the types of media', interaction);
      ref.update({ type: newValue });
      break;
    case 'Length':
      let length = Number(newValue) || -1;
      if (length === -1 || isNaN(Number(length))) return fail('Input must be a number', interaction);
      ref.update({ length: newValue });
      break;
    case 'Nickname':
      ref.update({ nickname: newValue });
      break;
    case 'Artist':
      ref.update({ artist: newValue });
      break;
    case 'Title':
      ref.update({ title: newValue });
      break;
    case 'Poster':
      ref.update({ poster: newValue });
      break;
    case 'UpdateChannel':
      ref.update({ updateChannel: newValue });
      break;
    case 'ReleaseChannel':
      ref.update({ releaseChannel: newValue });
      break;
  }

  const embed = new EmbedBuilder()
    .setTitle(`Project Modification`)
    .setDescription(`I have updated Project #${projects[project].pnumber}, \`${projects[project].nickname}\` for you.`)
    .setColor(0xc58433);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}