# GERTRUDE Discord Bot

Gertrude is a discord bot used for tracking your Music Ripping progress, modified from 9vult's nino

****

### Setup

 - GERTRUDE, just like [Nino](https://github.com/9vult/nino), requires a [Firebase Real-Time Database](https://firebase.google.com/docs/database) for logging and leaderboards. The base tier is free, and it is highly unlikely both bots will ever generate enough data to exceed the base tier.

Create a `.env` file in the project root and add the following to it: 

 - `TOKEN='[yourtoken]'`
 - `DATABASE_URL='[databaseurl]'`

Then, place your `firebase.json`, which is your serviceAccountKey.json, rename it to firebase, in the `/src/` folder.

### Command List

See [Documentation](https://github.com/Coolman513/GERTRUDE/blob/main/DOC.md)

### Development

Pull requests are always welcome.

### License

Nino is licensed under LGPL v3.0.


© 2024 9volt/CoolMan513.
