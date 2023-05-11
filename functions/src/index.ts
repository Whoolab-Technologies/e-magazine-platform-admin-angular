import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import * as moment from 'moment';

const cors = require('cors')({
    origin: true,
});
admin.initializeApp();
const database = admin.firestore()

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const adminSignup = functions.https.onRequest((req, res) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    return cors(req, res, async () => {
        res.json({ msg: 'admin has been created!' })
    });
});


// classes/${className}/subjects/${subject}/editions/${editionData.id}

exports.listenEdition = functions.firestore
    .document('classes/{className}/subjects/{subject}/editions/{edition}')
    .onWrite(async (change, context) => {
        const afterData = change.after.data();
        const beforeData = change.before.data();
        functions.logger.info('afterData', { structuredData: true });
        functions.logger.info(afterData);

        functions.logger.info('beforeData', { structuredData: true });
        functions.logger.info(beforeData);

        if (!beforeData) {
            functions.logger.info('New Edition Created!', { structuredData: true });
            return true;

        }
        if (!afterData) {
            functions.logger.info('Edition Removed!', { structuredData: true });
            await database.doc(`editions/${beforeData.docId}`).delete();
            return true;
        }
        if (beforeData && afterData) {
            functions.logger.info('Edition updated!', { structuredData: true });
            const update: any = {}
            if (beforeData.date != afterData.date)
                update['date'] = afterData.date;
            if (beforeData.published != afterData.published)
                update['published'] = afterData.published;
            await database.doc(`editions/${beforeData.docId}`).update(update);

            return true;
        }

    });