import { Firestore, DocumentData, QueryDocumentSnapshot } from '@google-cloud/firestore';
import { TrashComments, TrashSummary } from './common/types';
import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { TrashGetter } from './common/types';

const getTrash = (db: Firestore): TrashGetter => {
    const getTrashDocuments = async (playerName: string): Promise<QueryDocumentSnapshot<DocumentData>[]> => {
        const playersRef = db.collection('players');
        const playerNameStripped = playerName.toLowerCase().replace(/\s/g, '');
        const trashPlayerData = (await playersRef.where('player_name_stripped', '==', playerNameStripped).get()).docs;

        return trashPlayerData;
    };

    const createTrashPlayerSummary = (trashPlayer: QueryDocumentSnapshot<DocumentData>[]): TrashSummary => {
        if (trashPlayer.length === 0) {
            return {};
        }

        const trashComments = trashPlayer.reduce(
            (trashComments: TrashComments[], currrentComment: QueryDocumentSnapshot<DocumentData>): TrashComments[] => {
                trashComments.push({
                    comment: currrentComment.data().comment,
                    reportedBy: currrentComment.data().reported_by,
                });

                return trashComments;
            },
            [],
        );

        return {
            playerName: trashPlayer[0].data().player_name, // playerName should all be the same so take first one
            region: trashPlayer[0].data().region, // region should all be the same so take first one
            comments: trashComments,
        };
    };

    const getTrashPlayerEmbed = (playerTrashSummary: TrashSummary): MessageEmbed | void => {
        if (playerTrashSummary.comments) {
            const trashEmbedFields = playerTrashSummary.comments.reduce<EmbedFieldData[]>(
                (formattedComments, comment) => {
                    formattedComments.push({
                        name: comment.reportedBy,
                        value: comment.comment ? comment.comment : 'no comments added',
                        inline: true,
                    });
                    return formattedComments;
                },
                [],
            );

            return new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Trash Name: ${playerTrashSummary.playerName}`)
                .setDescription('Report added by: ')
                .addFields(trashEmbedFields);
        }
    };

    return async (players: string[]): Promise<MessageEmbed[]> => {
        const playersTrashDocuments = await Promise.all(
            players.reduce<Promise<QueryDocumentSnapshot<DocumentData>[]>[]>((trashDocs, player) => {
                trashDocs.push(getTrashDocuments(player));
                return trashDocs;
            }, []),
        );

        const playersTrashSummary = playersTrashDocuments.reduce<TrashSummary[]>((trashSummary, trashDoc) => {
            trashSummary.push(createTrashPlayerSummary(trashDoc));
            return trashSummary;
        }, []);

        const playersTrashSummaryEmbed = playersTrashSummary.reduce<MessageEmbed[]>((embeds, player) => {
            const embed = getTrashPlayerEmbed(player);
            if (embed) {
                embeds.push(embed);
            }
            return embeds;
        }, []);

        return playersTrashSummaryEmbed;
    };
};

export default getTrash;
