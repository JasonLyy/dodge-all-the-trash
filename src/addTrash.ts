import { Firestore } from '@google-cloud/firestore';
import { Report } from './common/types';

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
// });

// const db = admin.firestore();

const addTrash = (db: Firestore) => {
    return async (playerReport: Report): Promise<void> => {
        const playersRef = db.collection('players');
        await playersRef.add(playerReport);
    };
};

export default addTrash;
