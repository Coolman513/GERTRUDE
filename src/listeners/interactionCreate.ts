import { Client, BaseInteraction, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import type { Database } from '@firebase/database-types';

import { DatabaseData } from "../misc/types";
import { NewProjectCmd } from "../commands/newProject.cmd";
import { AddStaffCmd } from "../commands/addStaff.cmd";
import { AddAdditionalStaffCmd } from "../commands/addAdditionalStaff.cmd";
import { HelpCmd } from "../commands/help.cmd";
import { AboutCmd } from "../commands/about.cmd";
import { DoneCmd } from "../commands/done.cmd";
import { UndoneCmd } from "../commands/undone.cmd";
import { ReleaseCmd } from "../commands/release.cmd";
import { SwapStaffCmd } from "../commands/swapStaff.cmd";
import { SwapAdditionalStaffCmd } from "../commands/swapAdditionalStaff.cmd";
import { TransferOwnershipCmd } from "../commands/transferOwnership.cmd";
import { RemoveStaffCmd } from "../commands/removeStaff.cmd";
import { RemoveAdditionalStaffCmd } from "../commands/removeAdditionalStaff.cmd";
import { DeleteProjectCmd } from "../commands/deleteProject.cmd";
import { EditProjectCmd } from "../commands/editProject.cmd";
import { AddpnumCmd } from "../commands/addProjectNumber.cmd";
import { RemovepnumCmd } from "../commands/removeProjectNumberCmd";
import { BlameCmd } from "../commands/blame.cmd";

export default (client: Client, db: Database, dbdata: DatabaseData): void => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const cmdInteraction = interaction as ChatInputCommandInteraction
    const { commandName } = cmdInteraction;
    switch (commandName) {
      case 'newproject':
        await NewProjectCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'addstaff':
        await AddStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'swapstaff':
        await SwapStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'removestaff':
        await RemoveStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'addadditionalstaff':
        await AddAdditionalStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'swapadditionalstaff':
        await SwapAdditionalStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'removeadditionalstaff':
        await RemoveAdditionalStaffCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'addpnum':
        await AddpnumCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'removepnum':
        await RemovepnumCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'done':
        await DoneCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'undone':
        await UndoneCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'release':
        await ReleaseCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'transferownership':
        await TransferOwnershipCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'editproject':
        await EditProjectCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'deleteproject':
        await DeleteProjectCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'blame':
        await BlameCmd(client, db, dbdata, cmdInteraction);
        break;
      case 'help':
        await HelpCmd(cmdInteraction);
        break;
      case 'about':
        await AboutCmd(cmdInteraction);
        break;
    }
  });

  client.on('interactionCreate', async (interaction: BaseInteraction) => {
    if (!interaction.isAutocomplete()) return;
    const { options, guildId } = interaction as AutocompleteInteraction;
    let focusedOption = options.getFocused(true);
    let choices;

    switch (focusedOption.name) {
      case 'project': {
        if (guildId === null || !(guildId in dbdata.guilds)) break;
        let projects = dbdata.guilds[guildId];
        choices = Object.keys(projects).filter(choice => choice.startsWith(focusedOption.value));
        await interaction.respond(choices.map(choice => ({ name: choice, value: choice })));
        return;
      }
      case 'pnum': {
        let projectName = options.getString('project');
        if (guildId === null || projectName === null || projectName === '') break;
        if (!(projectName in dbdata.guilds[guildId])) return;
        let project = dbdata.guilds[guildId][projectName];
        choices = [];
        for (let ep in project.pnumber) {
          let num = project.pnumber[ep].number;
          if (String(num).startsWith(String(focusedOption.value)))
            choices.push({ name: `${num}`, value: num });
        }
        await interaction.respond(choices.slice(0, 25));
        return;
      }
      case 'abbreviation': {
        let projectName = options.getString('project');
        let pnum = options.getNumber('pnum');
        if (guildId === null || projectName === null || projectName === '' || pnum === null) break;
        if (!(projectName in dbdata.guilds[guildId])) break;
        let project = dbdata.guilds[guildId][projectName];
        choices = [];
        for (let ep in project.pnumber) {
          if (project.pnumber[ep].number == pnum) {
            for (let taskId in project.pnumber[ep].tasks) {
              let task = project.pnumber[ep].tasks[taskId];
              if (task.abbreviation.startsWith(focusedOption.value.toUpperCase()))
              choices.push({ name: task.abbreviation, value: task.abbreviation });
            }
          }
        }
        await interaction.respond(choices);
        return;
      }
    }
    await interaction.respond([]);
    return;
  });
};