import { Firestore } from '@google-cloud/firestore';
import { Report } from './common/types';

const addTrash = (db: Firestore) => {
    return async (playerReport: Report): Promise<void> => {
        const playersRef = db.collection('players');
        await playersRef.add(playerReport);
    };
};

export default addTrash;
