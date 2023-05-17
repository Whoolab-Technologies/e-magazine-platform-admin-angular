import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
    return cors(req, res, async () => {
        const request = req.body;
        auth.createUser({
            email: request.email,
            emailVerified: false,
            password: request.password,
            displayName: request.name,
            disabled: false,
        }).then((usrRecord) => {
            database.doc(`admin/${usrRecord.uid}`).set({
                name: usrRecord.displayName,
                email: usrRecord.email,
            }).then(() => {
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
        return new Promise((resolve, reject) => {
            database.collection(`classes/${data.class}/subjects`).get().then((snapshot) => {
                const update: any = {
                    subjects: {}
                }

                snapshot.forEach((doc) => {
                    update.subjects[doc.id] = {
                        status: false,
                        self: true
                    };
                })
                update.subjects[Object.keys(update.subjects)[0]] = true;
                database.doc(`student/${context.params.studentId}`).update(update);
                resolve(true);

            }, error => {
                reject(false)

            });
        })

    });

exports.listenEdition = functions.firestore
    .document('classes/{className}/subjects/{subject}/editions/{edition}')
    .onWrite(async (change, _context) => {
        const afterData = change.after.data();
        const beforeData = change.before.data();
        if (!beforeData) {
            return true;

        }
        if (!afterData) {
            await database.doc(`editions/${beforeData.docId}`).delete();
            return true;
        }
        if (beforeData && afterData) {
            const update: any = {}
            if (beforeData.date != afterData.date)
                update['date'] = afterData.date;
            if (beforeData.published != afterData.published)
                update['published'] = afterData.published;
            await database.doc(`editions/${beforeData.docId}`).update(update);
            return true;
        }
        return true;


    });



export const notification = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        const students = request.students;
        const notification = request.notification;
        const payload = {
            notification: {
                title: notification.title,
                body: notification.message
            }
        };
        const tokens: any = await getToken(students, notification)
        if (tokens.length) {
            admin.messaging().sendToDevice([...tokens], payload).then((su) => {
                res.status(200).send({ message: 'Notifications send successfully' })

            }, (error) => {
                res.status(500).send(error)
            })
        }
        else {
            res.status(200).send({ message: 'Notifications send' })

        }

    });
});



function getToken(students: any[], notification: any) {
    let token: any = []
    let promises: any = []
    return new Promise((resolve, rejects) => {
        students.forEach(async (el, index) => {
            promises.push(database.doc(`device/${el}`).get())
            database.doc(`student/${el}/notifications/${notification.id}`).set(notification)
        })

        Promise.all(promises).then((results) => {
            results.forEach((doc) => {
                if (doc.exists && doc.data() != undefined) {
                    let temp = (doc.data() || { tokens: [] }).tokens;

                    token = [...token, ...temp]
                }

            })
            resolve(token);
        })
    })
}
