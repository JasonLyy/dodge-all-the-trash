import * as Discord from 'discord.js';
import * as admin from 'firebase-admin';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import * as gcpMetadata from 'gcp-metadata';
import messageProcessor from './msgProcessor';
import { Firestore } from '@google-cloud/firestore';
dotenv.config({ path: resolve(__dirname, './.env') });

const initialiseFireStore = (): Firestore => {
    // Invoked from non google machine
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = `${resolve(__dirname, './credentials.json')}`;
    }

    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });

    return admin.firestore();
};

const getDiscordAccessToken = async (): Promise<string | undefined> => {
    const gcpMetaDataAvailable = await gcpMetadata.isAvailable();

    if (gcpMetaDataAvailable) {
        return gcpMetadata.instance('DISCORD_SECRET_TOKEN');
    } else {
        return process.env.DISCORD_SECRET_TOKEN;
    }
};

const db = initialiseFireStore();

(async (): Promise<void> => {
    const discordToken = await getDiscordAccessToken();
    const client = new Discord.Client();

    client.on('ready', async () => {
        console.log('Bot Ready To Login');
    });

    client.on('message', (message: Discord.Message) => {
        messageProcessor(db)(message);
    });

    client.login(discordToken);
})();
