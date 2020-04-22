/* eslint-disable @typescript-eslint/camelcase */
import * as Discord from 'discord.js';
import { Firestore } from '@google-cloud/firestore';
import { MessageProcessor } from './common/types';
import * as config from './config.json';
import getTrash from './getTrash';
import addTrash from './addTrash';

const processInput = (db: Firestore): MessageProcessor => {
    const getUserInput = (message: string): [string[], string | undefined] => {
        const args = message.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        return [args, command];
    };

    const getPlayerNames = (args: string[]): string[] => {
        const getPastedPlayerNames = (splittedByLineBreak: string[]): string[] => {
            const playerNames = splittedByLineBreak.map((line) => {
                return line.split(' ').slice(0, -3).join(' '); // remove last three words per line (i.e. joined the lobby)
            });
            return playerNames;
        };

        const rejoinedString = args.join(' '); // rejoin args to handle special player name cases (spaces and pasted)
        const splitByLinebreak = rejoinedString.split('\n'); // pasted player names will have line breaks

        const pastedPlayerNames = splitByLinebreak.length > 1;

        let finalPlayerNames = splitByLinebreak; // without linebreaks, player name stored in index 0

        if (pastedPlayerNames) {
            finalPlayerNames = getPastedPlayerNames(splitByLinebreak);
        }
        return finalPlayerNames;
    };

    const getPlayerNameAndComment = (args: string[]): [string, string] => {
        const [playerName, comment] = args
            .join(' ')
            .split(`"`)
            .slice(0, 2)
            .map((word) => word.trim());

        return [playerName, comment];
    };

    const processCommandAdd = async (message: Discord.Message, args: string[]): Promise<void> => {
        const [playerNameToAdd, comment] = getPlayerNameAndComment(args);

        if (playerNameToAdd) {
            await addTrash(db)({
                comment: comment ? comment : '',
                player_name: playerNameToAdd,
                player_name_stripped: playerNameToAdd.toLowerCase().replace(/\s/g, ''),
                region: 'OCE',
                report_timestamp: new Date(),
                reported_by: `${message.author.username}#${message.author.discriminator}`,
            });

            message.reply(`Succesfully added ${playerNameToAdd} to dodge list`);
        } else {
            message.reply(`Invalid Input. Valid Format: E.g. !add TrashPlayer "inted my game"`);
        }
    };

    const processCommandCheck = async (message: Discord.Message, args: string[]): Promise<void> => {
        const playerNamesToCheck = getPlayerNames(args);
        const trashPlayersEmbed = await getTrash(db)(playerNamesToCheck);

        if (trashPlayersEmbed.length > 0) {
            trashPlayersEmbed.forEach((embed) => {
                const hasBadComments = embed.fields.length > 0;
                if (hasBadComments) {
                    message.reply(embed);
                }
            });
        } else {
            message.reply('No Trash So Far..');
        }
    };

    return async (message: Discord.Message): Promise<void> => {
        try {
            const environmentChannelId = !process.env.GOOGLE_APPLICATION_CREDENTIALS
                ? config.channelId
                : config.channelId_dev;

            const validMessage =
                message.content.startsWith(config.prefix) && !message.author.bot && environmentChannelId;

            if (!validMessage) {
                return;
            }

            const [args, command] = getUserInput(message.content);
            switch (command) {
                case 'add':
                    await processCommandAdd(message, args);
                    break;

                case 'check':
                    await processCommandCheck(message, args);
                    break;

                case 'help':
                    break;
            }
        } catch (error) {
            message.reply(`Unknown error has occured`);
            console.log('ERROR: ', error);
        }
    };
};

export default processInput;
