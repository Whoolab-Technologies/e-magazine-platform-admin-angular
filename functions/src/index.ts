import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
const Razorpay = require('razorpay');

var crypto = require('crypto');
const _rPayOption = {
    key_id: 'rzp_test_HpQRLpieZtcYTA',
    key_secret: 'Wlb6bSK5l5Oa7zrUr37leMCy',
}

const _razorPay = new Razorpay(_rPayOption);
const client = require('firebase-tools');
const cors = require('cors')({
    origin: true,
});
admin
    .initializeApp({
        credential: admin.credential.applicationDefault(),
    }
    );
const merchantSalt =
    "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCfbJKVAwFtR27A5tdkOZApXuT99w195vkkITSVTVNvwxAijjJFup3eO4i84iWCK6SeisXboha+4TKpVWKaHOGidN7EERmdxTPreZSl5I6Y7/hEzU1NJDSLnRcIctNurmff0wmcxiO5mfCUcGMoX4bmGkyAfaMdZPUilfF+Mjqz0knF7abCn/pc22RUc83uugEK4QNVmnh/l9ItIDu03Ss3G2KX1VNn3DKpEwkITOYsEtkq/BTkC3T5lgfxC9KGZAAUTOrZamhRNLXNm6zCOpt36X7A0aqqjAGv843Z1XAQqoXzbjRf34DbYvqD/4AQsdvbqWRKFWRn3HqfP4640XdvAgMBAAECggEAdfVUo/LcXGoNNafX2S2KUEIJdywUDIMY9rWm/Y2AXeJbjuXdpqBE7MjqDK/bhuwZ2sDdUvwkjkl8PbSSx2r1PEnzBemNJaJjHykPZoutQtXTwbySJLDUPDUYdMTZUjyzWPYCV8B3cH3Jd1uM0rOT0a/FyRCs3zPy+Qsu6uvpaWDU5RfZQEoF+L6cCAKAqBrCOS3yHIWNpfl1M2JT7TA+yPFlzmcObHAqmJE/6ke90YmfBYVuM+7S+2c/dA0k7DyATDVlAVCThKTNwHvzT5/hQx3Q7bWuJN+iZCtUqoV114H5Kxqi73W3ezZFkRfQQUGzXv5lpnwsQytEp6sdCrjR2QKBgQDQDe/7BUZzmxI7fBYetT1OCoq/zl4l+/6lkSblRHro+Sa1/dVya2AdyA/jg9xcXiC8CZrrwr0ULsY+wXkLPk3maGtksYG1AKp7prXJUhOka95u80tsQVt0KExBtUrYg6Bx5n1BhaCgY66HtRMT8UeaIZh+Ub4cCXQRHuVsObH+BQKBgQDEKbbc14tXPSvU161EUJ5ywI/P7fkhop5+sXE1XzAp0EV8e0Tu8+hvMaDj8KLRcDAUYbzKSPbfp0EQsrQXVdjo90FtXvgmDe3PH2BkHmU+8j4iPEgR5IVxbdbL4zFy1rE5P5DT4iqcGx4Gkyd6+ncbzT3kAb007wr5Y819WXSl4wKBgBRPqAP7idszYl5ISOiKjQeXY+BBx1Mx/LQxLXjobI9d83eE5lebP/DoXRS7BMJHti5lSaiGhGr5/gSWYrjERlqeCw3zflQrUnlr1wdmaeB9X2O5gL16y/DVFky75CirAPjdpZDF+N5vnNRGyywBPBpB+V8rn8Gg8qHRQFiGcWf5AoGAAxLwRaevDE/uFujGU1K8GOpBlq2RAODugOfA8WgrdgxIennoC6KQ2uU5Mzk7I/MRHdCmR7k6/Sg+0ccrIU58FrKBOPiLBPWk62D/frInPgRHyvuM2ZLuMGfbPNizlqwcnNwNJfTeXBHkt4+ox7mTEkF2HdOVJnY0gtH4j2VOeacCgYAK3aPWGCjymXs/UGhsnFY5FXE0ed6d9g4a8SX7yAJveSDJ58zLwrSgposQFz0Q9XQfadx4xF6yQ3yjCtSdxtaGgt1MJlahg2BGEdfydsq9bm8yPldpPM7+nXHODpEAaDRKe4tQ5F5UdK01hr38MwoMUXGB0SrGPA/yP7wyCjhEsg=="; // Add you Salt here.
const merchantSecretKey = ""; // Add Merchant Secrete Key - Optional

const database = admin.firestore()

const auth = admin.auth();
const PayUHashConstantsKeys = {
    hashName: "hashName",
    hashString: "hashString",
    hashType: "hashType",
    hashVersionV1: "V1",
    hashVersionV2: "V2",
    mcpLookup: "mcpLookup",
    postSalt: "postSalt",
}
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
                        if (snapshot.size > 0) {
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

export const editSubject = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        const subject = request.subject;
        const clsName = `${(request.classId).toUpperCase()}`;
        const subjectName = `${(subject.name).toUpperCase()}`;
        database.doc(`classes/${clsName}/subjects/${subject.id}`).
            set({
                name: subjectName,
                desc: subject.desc || '',
                image: subject.image || '',
                amount: subject.amount,
            }, { merge: true }).then(() => {
                var updates: any = {}
                updates[subject.id] = { name: subjectName }
                database.doc(`classes/${clsName}`).set({
                    subjects: updates,
                }, { merge: true });
                res.status(200).json({ msg: "Subject has updated successfully", data: req.body });
            }, (error: any) => {
                res.status(500).json(error);

            });

    })
});

export const removeSubject = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        client.firestore
            .delete(`classes/${request.classId}/subjects/${request.subjectId}`, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
                force: true
            }).then(() => {
                const key = `subjects.${request.subjectId}`;
                var updates: any = {};
                updates[key] = admin.firestore.FieldValue.delete(),
                    database.doc(`classes/${request.classId}`).update(updates).then(() => {
                        res.status(200).json({ msg: "Subject has been removed successfully", body: updates });

                    }, (error: any) => {

                        res.status(500).json(error);
                    });
            }, (error: any) => {

                res.status(500).json(error);
            });
    })
});


export const createClass = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        let promises: any[] = [];
        const request = req.body;
        const classes = request.class;

        classes.forEach((el: any) => {
            const clsName = `${(el.name).toUpperCase()}`;
            const id = el.id || clsName;
            var clsSubject: any = {};
            const subjects = el.subjects;
            (subjects).forEach((sub: any) => {

                const subject = `${(sub.name).toUpperCase()}`;
                const subjectId = sub.id || subject;
                clsSubject[subjectId] = {
                    name: subject
                }

                const subRef = database.doc(`classes/${id}/subjects/${subjectId}`).
                    set({
                        name: subject,
                        desc: sub.desc || '',
                        image: sub.image || '',
                        amount: sub.amount,
                    }, { merge: true })
                promises.push(subRef);
            });

            const ref = database.doc(`classes/${id}`).set({
                name: clsName,
                desc: el.desc || '',
                subjects: clsSubject,
            }, { merge: true });
            promises.push(ref);

        });

        Promise.all(promises).then((result) => {
            res.status(200).json({ msg: 'Class and subjects have been created!' });
        }, error => {

            res.status(500).json(error);
        });
    })
});


// });

export const removeClass = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;

        const clsName = `${(request.classId).toUpperCase()}`;
        client.firestore
            .delete(`classes/${clsName}`, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
                force: true
            }).then(() => {
                res.status(200).json({ msg: 'Class and subjects deleted successfully' });
            }, (error: any) => {
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
            var responseData = { ...resp };
            responseData.rpayKey = _rPayOption.key_id;
            res.status(201).send(responseData)
        }, (error: any) => {
            res.status(400).send(error)

        })
    });
});
exports.scheduledPublish = functions.pubsub.schedule('05 00 * * *').timeZone('Asia/Kolkata').onRun((context) => {
    const now = admin.firestore.Timestamp.now();
    return new Promise((resolve, reject) => {
        var promises: any = [];
        const update = { published: true };
        database.collection('editions').where('published', '==', false).where('date', '<', now).get().then((snapshots) => {
            snapshots.forEach(doc => {
                const path = doc.data().path;
                promises.push(doc.ref.delete())
                promises.push(database.doc(`${path}`).update(update))
            })
            Promise.all(promises).then(() => {
                resolve(true);
            }, error => {
                reject();
            })
        }, error => {
            reject()
        });
    });
});
export const createUser = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        //   const request = req.body;
        res.status(201).send({
            message: 'Request received send',
        })
    });
});

export const phonePePay = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        try {
            const request = req.body;
            functions.logger.info("request", { structuredData: true });
            functions.logger.info(request, { structuredData: true });
            // const tempRef = database.collection(`paymentsTemp`).doc();
            var hashName = request[PayUHashConstantsKeys.hashName];
            var hashStringWithoutSalt = request[PayUHashConstantsKeys.hashString];
            var hashType = request[PayUHashConstantsKeys.hashType];
            var postSalt = request[PayUHashConstantsKeys.postSalt];

            var hash = "";

            if (hashType == PayUHashConstantsKeys.hashVersionV2) {
                hash = getHmacSHA256Hash(hashStringWithoutSalt, merchantSalt);
            } else if (hashName == PayUHashConstantsKeys.mcpLookup) {
                hash = getHmacSHA1Hash(hashStringWithoutSalt, merchantSecretKey);
            } else {
                var hashDataWithSalt = hashStringWithoutSalt + merchantSalt;
                if (postSalt != null) {
                    hashDataWithSalt = hashDataWithSalt + postSalt;
                }
                hash = getSHA512Hash(hashDataWithSalt);
            }

            var finalHash: any = {};
            finalHash[hashName] = hash;

            functions.logger.info("finalHash", { structuredData: true });
            functions.logger.info(finalHash, { structuredData: true });
            functions.logger.info("hashName", { structuredData: true });
            functions.logger.info(hashName, { structuredData: true });


            res.status(201).send(finalHash)
        } catch (error: any) {
            functions.logger.info("error", { structuredData: true });
            functions.logger.info(error, { structuredData: true });

            res.status(error.code || 400).send(error);
        }
    });
});
function getSHA512Hash(hashData: string) {
    functions.logger.info("getSHA512Hash", { structuredData: true });
    var hash = crypto.createHash('sha512');
    var data = hash.update(hashData, 'utf-8');
    return data.digest('hex');
}

function getHmacSHA1Hash(hashData: string, salt: string) {
    functions.logger.info("getHmacSHA1Hash", { structuredData: true });

    return crypto.createHmac('sha1', salt).update(hashData).digest('hex');

}

function getHmacSHA256Hash(hashData: string, salt: string) {
    functions.logger.info("getHmacSHA256Hash", { structuredData: true });

    return crypto.createHmac('sha256', salt).update(hashData).digest('base64');
}