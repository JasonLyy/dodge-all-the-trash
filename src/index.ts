import * as Discord from 'discord.js';
import * as config from './config.json';
import processInput from './msgProcessor';

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Bot Ready');
});

client.on('message', (message: Discord.Message) => {
    processInput(message);
});

client.login(config.secret_token);
