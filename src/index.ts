import * as Discord from 'discord.js';
import * as admin from 'firebase-admin';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import messageProcessor from './msgProcessor';
import { Firestore } from '@google-cloud/firestore';
dotenv.config({ path: resolve(__dirname, '../.env') });

const initialiseFireStore = (): Firestore => {
    // Invoked from local machine
    const currentGoogleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!currentGoogleCredentials) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = resolve(__dirname, './credentials.json');
    }

    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });

    // Restore back to default
    process.env.GOOGLE_APPLICATION_CREDENTIALS = currentGoogleCredentials;

    return admin.firestore();
};

const db = initialiseFireStore();

const discordToken = process.env.DISCORD_SECRET_TOKEN;
const client = new Discord.Client();

client.on('ready', async () => {
    console.log('Bot Ready To Login');
});

client.on('message', (message: Discord.Message) => {
    messageProcessor(db)(message);
});

client.login(discordToken);
