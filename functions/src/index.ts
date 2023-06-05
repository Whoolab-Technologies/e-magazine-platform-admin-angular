import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';

const cors = require('cors')({
    origin: true,
});
admin.initializeApp();
const database = admin.firestore()
const auth = admin.auth()
const Razorpay = require('razorpay');

const _razorPay = new Razorpay({
    key_id: 'rzp_test_HpQRLpieZtcYTA',
    key_secret: 'Wlb6bSK5l5Oa7zrUr37leMCy',
});
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
    .onCreate(async (studentSnapshot, context) => {
        const data = studentSnapshot.data();
        return new Promise(async (resolve, reject) => {

            if (data.referrer) {
                database.collection(`student`)
                    .where('referralCode', '==', data.referrer).limit(1).get().then((snapshot) => {
                        functions.logger.info('snapshot', { structuredData: true });
                        functions.logger.info(snapshot.docs[0].id, { structuredData: true });
                        if (snapshot.size > 0) {
                            functions.logger.info(snapshot.docs[0].data().point, { structuredData: true });
                            snapshot.docs[0].ref.update({ points: admin.firestore.FieldValue.increment(10) })
                            studentSnapshot.ref.update({ points: admin.firestore.FieldValue.increment(10) })
                        }
                        resolve(true)
                    }, error => {
                        reject(true)
                    });
            }
            else {
                resolve(true)
            }
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
        notification['createdOn'] = moment(notification['createdOn']).toDate()
        var doc = await database.collection('notifications').add(notification);
        notification['id'] = doc.id;
        const payload = {
            notification: {
                title: notification.title,
                body: notification.message
            }
        };
        const tokens: any = await getToken(students, notification);
        if (tokens.length) {
            admin.messaging().sendToDevice([...tokens], payload).then((su) => {
                res.status(200).send({ id: doc.id, message: 'Notifications send successfully' })

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

            notification['read'] = false
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

export const createClass = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        let promises: any[] = [];
        const request = req.body;
        const classes = request.class;
        classes.forEach((el: any) => {
            const clsName = `${(el.name).toUpperCase()}`;
            const ref = database.doc(`classes/${clsName}`).set({
                name: clsName, desc: el.desc
            });
            promises.push(ref);
            const subjects = el.subjects;
            (subjects).forEach((sub: any) => {
                const subject = `${(sub.name).toUpperCase()}`;
                const subRef = database.doc(`classes/${clsName}/subjects/${subject}`).
                    set({
                        name: subject,
                        desc: sub.desc,
                        image: sub.image,
                        amount: sub.amount,
                    })
                promises.push(subRef);
            });
        });

        Promise.all(promises).then((result) => {
            res.status(200).json({ msg: 'Class and subjects have been created!' });
        }, error => {
            res.status(500).json(error);

        });
    });


});


export const razorpayOrder = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        var options = {
            amount: request.amount * 100,  // amount in the smallest currency unit
            currency: request.currency
        };
        _razorPay.orders.create(options).then((resp: any) => {
            request['createdOn'] = new Date();
            request['status'] = "started";
            database.doc(`payments/${resp.id}`).set(request);
            res.status(201).send(resp)
        }, (error: any) => {
            res.status(201).send(error)

        })
    });
});