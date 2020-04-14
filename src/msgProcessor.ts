/* eslint-disable @typescript-eslint/camelcase */
import * as Discord from 'discord.js';
import * as config from './config.json';
import getTrashPlayers from './getTrash';
import addTrashPlayer from './addTrash';

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

const processInput = async (message: Discord.Message): Promise<void> => {
    try {
        const validMessage =
            (message.content.startsWith(config.prefix) || message.author.bot) &&
            message.channel.id === config.channelId;

        if (!validMessage) {
            return;
        }

        const [args, command] = getUserInput(message.content);

        switch (command) {
            case 'add':
                const [playerNameToAdd, comment] = getPlayerNameAndComment(args);
                console.log(playerNameToAdd, comment);
                if (playerNameToAdd) {
                    await addTrashPlayer({
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
                break;

            case 'check':
                const playerNamesToCheck = getPlayerNames(args);
                const trashPlayersEmbed = await getTrashPlayers(playerNamesToCheck);

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
                break;

            case 'help':
        }
    } catch (error) {
        message.reply(`Unknown error has occured`);
        console.log('ERROR: ', error);
    }
};

export default processInput;
