import { Firestore, DocumentData } from '@google-cloud/firestore';
import { MessageEmbed } from 'discord.js';

const listTrash = async (db: Firestore): Promise<MessageEmbed> => {
    const getTrashListDocs = async (): Promise<DocumentData[]> => {
        const playersRef = db.collection('players');
        const trashPlayerData = (await playersRef.get()).docs.map((doc) => doc.data());

        return trashPlayerData;
    };

    const trashListDocs = await getTrashListDocs();
    const processedTrashList = trashListDocs.reduce((processedList, currentTrash) => {
        if (!processedList[currentTrash.player_name]) {
            processedList[currentTrash.player_name_stripped] = currentTrash;
            processedList[currentTrash.player_name_stripped]['count'] = 1;
        } else {
            processedList[currentTrash.player_name_stripped].currentTrash.count += 1;
        }
        return processedList;
    }, {});

    const outputTrashList = Object.entries(processedTrashList).sort();

    const embedLines = outputTrashList.map((trash) => {
        return {
            name: trash[1].player_name,
            value: `Report Count: ${trash[1].count}`,
            inline: true,
        };
    });

    console.log(embedLines);

    return new MessageEmbed().setColor('#0099ff').setDescription('Report added by: ').addFields(embedLines);
};

export default listTrash;
