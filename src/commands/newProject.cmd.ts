import { ChatInputCommandInteraction, Client, EmbedBuilder, GuildMember, PermissionsBitField } from "discord.js";
import { generateAllowedMentions } from "../actions/generateAllowedMentions.action";
import { DatabaseData, Project } from "../misc/types";
import { fail } from "../actions/fail.action";
import { Database } from "@firebase/database-types";

export const NewProjectCmd = async (client: Client, db: Database, dbdata: DatabaseData, interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { options, user, member, guildId } = interaction;
  if (guildId == null) return;

  await interaction.deferReply();

  if (!(member as GuildMember)?.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return fail("You must be an administrator to perform this action!", interaction);
  }

  const nickname = options.getString('nickname')!;
  const title = options.getString('title')!;
  const owner = String(user!.id);
  const artist = options.getString('artist')!;
  const type = options.getString('type')!;
  const length = options.getNumber('length')!;
  const poster = options.getString('poster')!;
  const pnumber = options.getNumber('pnumber')!;
  const color = options.getString('color')!;
  const updateChannel = options.getChannel('updatechannel')!.id;
  const releaseChannel = options.getChannel('releasechannel')!.id;

  const ref = db.ref(`/Projects/`).child(`${guildId}`).child(`${nickname}`);
  const newProj: Project = {
    nickname,
    title,
    owner,
    length,
    poster,
    artist,
    type,
    keyStaff: [],
    pnumber,
    color,
    done: false,
    scansDone: false,
    updateChannel,
    releaseChannel,
    additionalStaff: [],
    tasks: [],
    scans: []
  };
  ref.set(newProj);

  const embed = new EmbedBuilder()
    .setTitle(`Project Creation`)
    .setDescription(`Since you asked, I created Project #${pnumber}, \`${nickname}\` for you.\nDo remember to add staff/positions, though.`)
    .setColor(0xc58433);
  await interaction.editReply({ embeds: [embed], allowedMentions: generateAllowedMentions([[], []]) });
}