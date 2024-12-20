import { Client, SlashCommandBuilder } from "discord.js";

export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) return;

    const helpCmd = new SlashCommandBuilder()
      .setName('help')
      .setDescription('GERTRUDE Help');

    const aboutCmd = new SlashCommandBuilder()
      .setName('about')
      .setDescription('About GERTRUDE');

    const newProjectCmd = new SlashCommandBuilder()
      .setName('newproject')
      .setDescription('Create A New Project')
      .addStringOption(o =>
        o.setName('nickname')
          .setDescription('Project Nickname')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('title')
          .setDescription('Full Title')
          .setRequired(true)
      )
      .addNumberOption(o =>
        o.setName('pnumber')
          .setDescription('Project #')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('color')
          .setDescription('Choose Color For Done/Undone/Blame (Input a Color Hex, Precede with 0x)')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('artist')
          .setDescription('What Is The Artist Of The Media?')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('type')
          .setDescription('Project Type')
          .setRequired(true)
          .setChoices(
            { name: 'Vinyl', value: 'Vinyl' },
            { name: 'Cassette', value: 'Cassette' },
            { name: 'CD', value: 'CD' },
            { name: 'SACD', value: 'SACD' },
            { name: 'BD', value: 'BD' }
          )
      )
      .addNumberOption(o =>
        o.setName('length')
          .setDescription('Number Of Tracks')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('poster')
          .setDescription('Poster Image URL')
          .setRequired(true)
      )
      .addChannelOption(o =>
        o.setName('updatechannel')
          .setDescription('Channel To Post Uupdates To')
          .setRequired(true)
      )
      .addChannelOption(o =>
        o.setName('releasechannel')
          .setDescription('Channel To Post Releases To')
          .setRequired(true)
      );

    const addStaffCmd = new SlashCommandBuilder()
      .setName('addstaff')
      .setDescription('Add Staff To A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('title')
          .setDescription('Full Position Name')
          .setRequired(true)
      );

      const addScansCmd = new SlashCommandBuilder()
      .setName('addscans')
      .setDescription('Add A Scan To A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Scan Shorthand')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('title')
          .setDescription('Full Scan Name')
          .setRequired(true)
      );

      const batchDoneWScansCmd = new SlashCommandBuilder()
      .setName('batchdonewscans')
      .setDescription('Mark All Scans As Done')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      );

      const removeScansCmd = new SlashCommandBuilder()
      .setName('removescans')
      .setDescription('Remove A Scan From A project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Scan Shorthand')
          .setRequired(true)
      );

      const removeStaffCmd = new SlashCommandBuilder()
      .setName('removestaff')
      .setDescription('Remove Staff From A project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      );

    const swapStaffCmd = new SlashCommandBuilder()
      .setName('swapstaff')
      .setDescription('Swap staff Into A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      );

    const addAdditionalStaffCmd = new SlashCommandBuilder()
      .setName('addadditionalstaff')
      .setDescription('Add Additional Staff To A Position')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      )
      .addStringOption(o =>
        o.setName('title')
          .setDescription('Full Position Name')
          .setRequired(true)
      );

    const removeAdditionalStaffCmd = new SlashCommandBuilder()
      .setName('removeadditionalstaff')
      .setDescription('Remove Additional Staff From A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      );

    const swapAdditionalStaffCmd = new SlashCommandBuilder()
      .setName('swapadditionalstaff')
      .setDescription('Swap Additional Staff Into A Position')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      );

    const transferOwnershipCmd = new SlashCommandBuilder()
      .setName('transferownership')
      .setDescription('Transfer Project Ownership To Someone Else')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addUserOption(o =>
        o.setName('member')
          .setDescription('Staff Member')
          .setRequired(true)
      );

    const deleteProjectCmd = new SlashCommandBuilder()
      .setName('deleteproject')
      .setDescription('Delete A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      );

    const editProjectCmd = new SlashCommandBuilder()
      .setName('editproject')
      .setDescription('Edit a project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('option')
          .setDescription('Option to change')
          .setRequired(true)
          .addChoices(
            { name: 'Pnumber', value: 'Pnumber' },
            { name: 'Color', value: 'Color' },
            { name: 'Type', value: 'Type' },
            { name: 'Length', value: 'Length' },
            { name: 'Nickname', value: 'Nickname' },
            { name: 'Artist', value: 'Artist' },
            { name: 'Title', value: 'Title' },
            { name: 'Poster', value: 'Poster' },
            { name: 'UpdateChannelID', value: 'UpdateChannel' },
            { name: 'ReleaseChannelID', value: 'ReleaseChannel' }
          )
      )
      .addStringOption(o =>
        o.setName('newvalue')
          .setDescription('New value')
          .setRequired(true)
      );
      
    const doneCmd = new SlashCommandBuilder()
      .setName('done')
      .setDescription('Mark A Position As Done')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
          .setAutocomplete(true)
      );

    const doneWScansCmd = new SlashCommandBuilder()
      .setName('donewscans')
      .setDescription('Mark A Scan As Done')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Scan Shorthand')
          .setRequired(true)
          .setAutocomplete(true)
      );

    const undoneCmd = new SlashCommandBuilder()
      .setName('undone')
      .setDescription('Mark A Position As Not Done')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Position Shorthand')
          .setRequired(true)
          .setAutocomplete(true)
      );

      const undoneWScansCmd = new SlashCommandBuilder()
      .setName('undonewscans')
      .setDescription('Mark A Scan As Not Done')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('abbreviation')
          .setDescription('Scan Shorthand')
          .setRequired(true)
          .setAutocomplete(true)
      );

    const blameCmd = new SlashCommandBuilder()
      .setName('blame')
      .setDescription('Check The Status Of A Project')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Name')
          .setRequired(true)
          .setAutocomplete(true)
      )

      const blameScansCmd = new SlashCommandBuilder()
      .setName('blamescans')
      .setDescription('Check The Status Of The Scans')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Name')
          .setRequired(true)
          .setAutocomplete(true)
      )

    const releaseCmd = new SlashCommandBuilder()
      .setName('release')
      .setDescription('Release!')
      .addStringOption(o =>
        o.setName('project')
          .setDescription('Project Nickname')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption(o =>
        o.setName('url')
          .setDescription('Release URL')
          .setRequired(true)
      )
      .addRoleOption(o =>
        o.setName('role')
          .setDescription('Role To Ping')
          .setRequired(false)
      );

    client.application.commands.create(helpCmd);
    client.application.commands.create(aboutCmd);
    client.application.commands.create(newProjectCmd);
    client.application.commands.create(addStaffCmd);
    client.application.commands.create(addScansCmd);
    client.application.commands.create(batchDoneWScansCmd);
    client.application.commands.create(removeStaffCmd);
    client.application.commands.create(removeScansCmd);
    client.application.commands.create(swapStaffCmd);
    client.application.commands.create(addAdditionalStaffCmd);
    client.application.commands.create(removeAdditionalStaffCmd);
    client.application.commands.create(swapAdditionalStaffCmd);
    client.application.commands.create(transferOwnershipCmd);
    client.application.commands.create(deleteProjectCmd);
    client.application.commands.create(editProjectCmd);
    client.application.commands.create(doneCmd);
    client.application.commands.create(doneWScansCmd);
    client.application.commands.create(undoneCmd);
    client.application.commands.create(undoneWScansCmd);
    client.application.commands.create(blameCmd);
    client.application.commands.create(blameScansCmd);
    client.application.commands.create(releaseCmd);

    console.log('GERTRUDE is ready to go!');
  });
};

