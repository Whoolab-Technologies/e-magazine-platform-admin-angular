import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import * as moment from 'moment';

const cors = require('cors')({
    origin: true,
});
admin.initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const adminSignup = functions.https.onRequest((req, res) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    return cors(req, res, async () => {
        res.json({ msg: 'admin has been created!' })
    });
});
