# GERTRUDE Documentation

## Creating a project

Despite there being a single "[/newproject](#newproject)" command, it actually takes
a few different commands to get a project fully set up. Here's an outline of
the steps to take to bootstrap a project:

1. Run [/newproject](#newproject). The newproject command will set all the basic information,
  most relating to the display in progress updates.
2. [/addstaff](#addstaff/addscans) to the project. These Key Staff are the tasks that will be done on every project.
  You can set placeholder members and [/swapstaff](#swapstaff) later on.
3. If there are any tasks that will only be on a single project, such as scanning additional items
  on episode 1, use [/addadditionalstaff](#addadditionalstaff).
4. Use [/editproject](#editproject) to reset certain values for the project or for the embeds in [/blame](#blame).
5. System for scans has now been added in V3. It can be used separately from the main project system or not used at all. It has the same features as the main one such as [/addscans](#addstaff/addscans), [/blamescans](#blame/blamescans), [/donewscans](#done/donewscans), [/undonewscans](#undone/undonewscans), and [/removescans](#removestaff/removescans). Just make sure when you're inputting addScans or addStaff that you don't mix the others up.
6. That is about it, if you have any issues, feel free to tell me in issues.

- **Rec**: I recommend setting the Name of staff positions to `-ing` verbs, as they will look
  the best in progress updates and [/blame](#blame).
- **Note**: Additional Staff will always be displayed after Key Staff. This cannot be changed.

## Commands - Project management

### newproject

Set up a new project. This command is only accessible by server administrators.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| nickname | yes | string | Short nickname for referring to the project in other commands |
| title | yes | string | Full name of the series (used in embeds) |
| pnumber | yes | number | Project number (used in embeds) |
| color | yes | string | Hex color string (0x needs to precede string, used in embeds) |
| artist | yes | string | Artist of the media in the project (used in embeds) |
| type | yes | choose | Type of media the project is. Choose between Vinyl, Cassette, CD, or BD |
| length | yes | number | Number of tracks present on the media |
| poster | yes | string<URL> | Poster image URL (used in embeds) |
| updatechannel | yes | channel | Channel to post progress updates in |
| releasechannel | yes | channel | Channel to post releases in |

### addstaff/addscans

Add a staff position to the project, applying to all episodes.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| member | yes | user | Member being assigned the position |
| abbreviation | yes | string | Shorthand for the position (ex: RIP) |
| title | yes | string | Full name of the position (ex: Ripping) |

### removestaff/removescans

Remove a staff position from the project, applying to all episodes.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| abbreviation | yes | string | Shorthand for the position (ex: RIP) |

### swapstaff

Swap someone else in for a position, applying to all episodes.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| abbreviation | yes | string | Shorthand for the position (ex: RIP) |
| member | yes | user | Member being assigned the position |

### addadditionalstaff

Add a staff position for a single episode.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| episode | yes | number | Episode to add the task to |
| member | yes | user | Member being assigned the position |
| abbreviation | yes | string | Shorthand for the position (ex: SCAN) |
| title | yes | string | Full name of the position (ex: Scanning) |

### removeadditionalstaff

Remove an additional-staff position.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| episode | yes | number | Episode to add the task to |
| abbreviation | yes | string | Shorthand for the position (ex: RIP) |

### swapadditionalstaff

Swap someone else in for an additional-staff position.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| episode | yes | number | Episode to add the task to |
| abbreviation | yes | string | Shorthand for the position (ex: RIP) |
| member | yes | user | Member being assigned the position |

### transferownership

Transfer ownership of the project to someone else.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| member | yes | user | New project owner |

### deleteproject

Delete a project.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |

### editproject

Edit project values.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| option | yes | choose | Choose an option |
| newvalue | yes | any | New value of the option |

Options:

| Option | Input type | Description |
|--------|------------|-------------|
| Pnumber | number | Project number |
| Color | string | | Hex color string (0x needs to precede string) |
| Type | string | Type of media the project is. Has to be Vinyl, Cassette, CD, or BD |
| Length | number | Number of tracks present on the media |
| Nickname | string | Short nickname for referring to the project in other commands |
| Artist | string | Artist of the media in the project |
| Title | string | The show title |
| Poster | string<URL> | Poster URL |
| UpdateChannelID | string | ID of channel to post updates in |
| ReleaseChannelID | string | ID of channel to post releases in |

## Commands - Progress

### done/donewscans

Mark a task as complete. Accessible by assigned user and project owner.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| abbreviation | yes | string | Shorthand for the position (ex: Rip) |

### undone/undonewscans

Mark a task as incomplete. Accessible by assigned user and project owner.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| abbreviation | yes | string | Shorthand for the position (ex: TM) |

### release

Release! Accessible by project owner.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |
| url | yes | string<URL> | Url linking to the release |
| role | no | role | Role to be pinged (Does not affect observer servers) |

### blame/blamescans

Check the status of a project or episode. Accessible by everyone.

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| project | yes | string | Project nickname |

## Commands - Other

### help

Displays some simple help.

### about

Displays some information about Nino.
