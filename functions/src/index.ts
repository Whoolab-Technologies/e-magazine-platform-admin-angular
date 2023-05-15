import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//import * as moment from 'moment';

const cors = require('cors')({
    origin: true,
});
admin.initializeApp();
const database = admin.firestore()
const auth = admin.auth()

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const createAdmin = functions.https.onRequest((req, res) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    return cors(req, res, async () => {
        const request = req.body;
        auth.createUser({
            email: request.email,
            emailVerified: false,
            password: request.password,
            displayName: request.name,
            disabled: false,
        }).then((usrRecord) => {
            functions.logger.info('usrRecord', { structuredData: true });
            functions.logger.info(usrRecord, { structuredData: true });

            database.doc(`admin/${usrRecord.uid}`).set({
                name: usrRecord.displayName,
                email: usrRecord.email,
            }).then(() => {
                functions.logger.info("set data", { structuredData: true });

                res.status(200).json({ msg: 'Admin has been created!' });

            }, error => {
                auth.deleteUser(usrRecord.uid);
                res.status(500).json(error);
            })

        }, (error) => {
            res.status(500).json(error);
        })
    });
});

export const createStudent = functions.https.onRequest((req, res) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    return cors(req, res, async () => {
        const request = req.body;
        const student = {
            name: request.name,
            email: request.email,
            address: request.address,
            class: request.class,
            syllabus: "CBSE",
        }

        database.collection(`student`).add(student).then((doc) => {
            functions.logger.info("add data", { structuredData: true });
            functions.logger.info(doc.id, { structuredData: true });

            res.status(200).json({ msg: 'Student has been created!' });

        }, error => {
            res.status(500).json(error);
        })


    });
});



// classes/${className}/subjects/${subject}/editions/${editionData.id}

exports.listenStudent = functions.firestore
    .document('student/{studentId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();
        functions.logger.info('data', { structuredData: true });
        functions.logger.info(data, { structuredData: true });
        functions.logger.info("class", { structuredData: true });
        functions.logger.info(data.class, { structuredData: true });
        return new Promise((resolve, reject) => {
            database.collection(`classes/${data.class}/subjects`).get().then((snapshot) => {
                functions.logger.info("snapshot", { structuredData: true });
                functions.logger.info(snapshot.size, { structuredData: true });

                const update: any = {
                    subjects: {}
                }

                snapshot.forEach((doc) => {
                    functions.logger.info('doc', { structuredData: true });
                    functions.logger.info(doc.id, { structuredData: true });

                    update.subjects[doc.id] = {
                        status: false,
                        self: true
                    };
                })
                update.subjects[Object.keys(update.subjects)[0]] = true;
                functions.logger.info('student update', { structuredData: true });
                functions.logger.info(update, { structuredData: true });
                functions.logger.info('{context.params.studentId', { structuredData: true });
                functions.logger.info(`${context.params.studentId}`, { structuredData: true });

                database.doc(`student/${context.params.studentId}`).update(update);
                resolve(true);

            }, error => {
                functions.logger.error("error", { structuredData: true });
                functions.logger.error(error, { structuredData: true });
                reject(false)

            });
        })

    });

exports.listenEdition = functions.firestore
    .document('classes/{className}/subjects/{subject}/editions/{edition}')
    .onWrite(async (change, _context) => {
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
            functions.logger.info('update!', { structuredData: true });
            functions.logger.info(update, { structuredData: true });

            await database.doc(`editions/${beforeData.docId}`).update(update);

            return true;
        }

        return true;


    });