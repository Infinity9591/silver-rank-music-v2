const {token} = require('./config.json');
const {Client, Collection } = require('discord.js');
const {readdirSync} = require("node:fs");
const {join} = require('node:path');

const client = new Client({intents : [16,512,128,1]});

client.commands = new Collection();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = join(__dirname, 'events'); //read file in folder events
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js')); //read file has .js extension

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token).then(r => {});