import { Firestore } from '@google-cloud/firestore';
import * as config from './config.json';
import { Report } from './common/types';

const db = new Firestore({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
});

const addTrashPlayer = async (playerReport: Report): Promise<void> => {
    const playersRef = db.collection('players');
    await playersRef.add(playerReport);
};

export default addTrashPlayer;
