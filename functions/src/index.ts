import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
const Razorpay = require('razorpay');

var crypto = require('crypto');
const _rPayOption = {

    // key_id: 'rzp_live_qs5T4yjZ2v0LQH',
    // key_secret: '4Sh81NXb7qy0qBG15xIu1s7Z',
    key_id: 'rzp_test_PgXrQp07PbCOhm',
    key_secret: 'oAKkRrCJOpvUU6tHhcSEUO5a',
}
// const _rPayOptionTest = {
// key_id: 'rzp_test_PgXrQp07PbCOhm',
// key_secret: 'oAKkRrCJOpvUU6tHhcSEUO5a',
// }
// const _rPayOptionLive = {
//     key_id: 'rzp_live_qs5T4yjZ2v0LQH',
//     key_secret: '4Sh81NXb7qy0qBG15xIu1s7Z',
// }

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
exports.listenDeviceChange = functions.firestore
    .document('device/{studentId}')
    .onUpdate(async (change, context) => {
        return new Promise(async (resolve, reject) => {
            const beforeData = change.before.data()
            const afterData = change.after.data()
            let tokens = [];
            if (afterData.currentDevice && beforeData.currentDevice != afterData.currentDevice) {
                tokens = afterData.tokens
                const indx = tokens.indexOf(afterData.currentDevice)
                tokens.splice(indx, 1);
            }
            const payload = {
                notification: {
                    title: "New Device Detected",
                    body: "Your acccount has been logged in another device."
                },
                data: {
                    removed: "true",
                }
            };
            if (tokens.length) {
                admin.messaging().sendToDevice([...tokens], payload).then((success) => {
                    resolve({ message: 'Notifications send successfully' })

                }, (error) => {

                    reject(error)
                })
            }
            resolve({ message: 'Notifications send successfully' })

        });
    });

export const createAdmin = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        const adminRequest = request.admin;
        const { name, email } = adminRequest;
        let usrRecord: any = null;
        let adm: any;
        let student: any;
        auth.createUser({
            email: email,
            emailVerified: true,
            password: request.password,
            displayName: name,
            disabled: false,
        }).then(async (userRecod) => {
            const customClaims = {
                admin: true
            }
            usrRecord = userRecod;
            try {
                await auth.setCustomUserClaims(usrRecord.uid, customClaims);
                adm = await database.doc(`admin/${usrRecord.uid}`);
                adm.set({ name, email });
                student = await database.doc(`student/${usrRecord.uid}`);
                student.set(adminRequest)
                res.status(200).send({ user: usrRecord, msg: 'Admin has been created!' });

            } catch (error) {
                if (adm)
                    adm.ref.delete();
                if (student)
                    student.ref.delete();
                auth.deleteUser(usrRecord.uid);
                res.status(500).send(error);
            }

        }, (error) => {
            auth.deleteUser(usrRecord.uid);
            res.status(500).send(error);
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
            res.status(200).send({ msg: 'Student has been created!' });
        }, error => {
            res.status(500).send(error);
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

exports.listenAdminDelete = functions.firestore
    .document('admin/{id}')
    .onDelete(async (_, context) => {
        return new Promise(async (resolve, reject) => {
            client.firestore
                .delete(`student/${context.params.id}`, {
                    project: process.env.GCLOUD_PROJECT,
                    recursive: true,
                    yes: true,
                    force: true
                })
            auth.deleteUser(`${context.params.id}`).then(() => {
                resolve(true)
            }, (error) => {
                reject(error)
            })
        });
    });

exports.listenDeleteStudent = functions.firestore
    .document('student/{studentId}')
    .onDelete(async (_, context) => {
        return new Promise(async (resolve, reject) => {
            client.firestore
                .delete(`student/${context.params.studentId}`, {
                    project: process.env.GCLOUD_PROJECT,
                    recursive: true,
                    yes: true,
                    force: true
                }).then(() => {
                    client.firestore
                        .delete(`admin/${context.params.studentId}`, {
                            project: process.env.GCLOUD_PROJECT,
                            recursive: true,
                            yes: true,
                            force: true
                        });
                    auth.deleteUser(`${context.params.studentId}`);
                    resolve(true)
                }, (error: any) => {

                    reject(error)
                });
        });
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
                    database.collection(`editions`)
                        .where("class", "==", request.classId)
                        .where("subject", "==", request.subjectId)
                        .get().then((querySnapshot) => {
                            querySnapshot.forEach((document) => {
                                document.ref.delete()
                            });
                        });
                database.doc(`classes/${request.classId}`).update(updates).then(() => {
                    res.status(200).send({ msg: "Subject has been removed successfully", body: updates });

                }, (error: any) => {

                    res.status(500).send(error);
                });
            }, (error: any) => {

                res.status(500).send(error);
            });
    })
});

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
                database.collection(`editions`)
                    .where("class", "==", request.classId)
                    .get().then((querySnapshot) => {
                        querySnapshot.forEach((document) => {
                            document.ref.delete()
                        });
                    });
                res.status(200).send({ msg: 'Class and subjects deleted successfully' });
            }, (error: any) => {
                res.status(500).send(error);
            });
    });
});

export const razorpayOrder = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        var options = {
            amount: request.amount * 100,  // amount in the smallest currency unit
            // amount: 1 * 100,  // amount in the smallest currency unit
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
    return new Promise(async (resolve, reject) => {
        var promises: any = [];
        const update = { published: true, featureTag: "Latest", };
        updateExpiryStatus()
        updateTagStatus()
        database.collection('editions').where('published', '==', false).where('date', '<', now).get().then((snapshots) => {
            snapshots.forEach(doc => {
                const path = doc.data().path;
                //promises.push(doc.ref.delete())
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

export const sendOtp = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        //   const request = req.body;
        var val = Math.floor(1000 + Math.random() * 9000);
        var response = JSON.parse(JSON.stringify({
            "data": val.toString(),

            "message": `Otp has been send to your number`,
        }))
        res.status(201).send(response)
    });
});

export const verifyOtp = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        database.collection('otp').doc(request.mobile).get().then((doc: any) => {


            if (!doc.exists) {
                res.status(404).send({
                    success: 0,
                    data: [],
                    text: 'Invalid mobile number ',
                })
            }
            else {
                let data = doc.data()
                const givenTime = moment(data.date.toDate());

                // Get the current time
                const currentTime = moment();

                const timeDifferenceInMillis = givenTime.diff(currentTime);

                // Convert milliseconds to minutes
                const timeDifferenceInMinutes = Math.abs(moment.duration(timeDifferenceInMillis).asMinutes());
                if (timeDifferenceInMinutes > 10) {
                    res.status(400).send({
                        success: 0,
                        data: [],
                        text: 'Otp Expired',
                    });
                }
                else if (data.code == request.code) {
                    doc.ref.delete();
                    res.status(201).send({
                        success: 0,
                        data: [],
                        text: 'Otp verification successful',
                    });
                }
                else {
                    res.status(404).send({
                        success: 0,
                        data: [],
                        text: 'Incorrect otp',
                    });
                }
            }

        }, (error: any) => {

            res.status(404).send({
                success: 0,
                data: [],
                text: error.toString(),
            });
        });

    });
});

export const updateRole = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const request = req.body;
        const customClaims = {
            admin: true
        }
        try {
            await auth.setCustomUserClaims(request.uid, customClaims);
            const userRecord = await auth.getUser(request.uid);
            res.status(204).send(userRecord);
        } catch (error: any) {
            res.status(error.code || 400).send(error);

        }

    });
});
export const phonePePay = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        try {
            const request = req.body;
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


            res.status(201).send(finalHash)
        } catch (error: any) {
            res.status(error.code || 400).send(error);
        }
    });
});
function updateTagStatus() {
    const now = admin.firestore.Timestamp.now();
    let oneMonth = moment(now).subtract(1, 'months');
    console.log(" oneMonth ", oneMonth)
    let promises: any = [];
    return new Promise(async (resolve, reject) => {
        const update = {
            featureTag: ""
        }
        database.collection('editions')
            .where('published', '==', true)
            .where('featureTag', '==', 'Latest')
            .where('date', '<', oneMonth)
            .get().then((snapshots) => {
                snapshots.forEach(doc => {
                    const path = doc.data().path;
                    //promises.push(doc.ref.delete())
                    promises.push(database.doc(`${path}`).update(update))
                })
                Promise.all(promises).then(() => {
                    resolve(true);
                }, error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
    });
}
function updateExpiryStatus() {
    return new Promise(async (resolve, reject) => {
        //   try {

        const now = admin.firestore.Timestamp.now();
        const classesColltn = await database.collection('classes').where('expiry_date', '<', now).get();
        let classIds: any[] = []
        classesColltn.forEach(async (doc) => {
            doc.ref.update({ expiry_date: null });
            classIds.push(doc.id)

        });

        // const classIds = classesColltn.docs.map(async (doc) => {
        //     // doc.ref.update({ expiry_date: null });
        //     return doc.id;
        // });
        let students: any[] = []
        if (classIds.length) {
            const studentsCollection = await database.collection('student').where('class', 'in', classIds).get();
            studentsCollection.docs.map(async (doc) => {
                const subjects = doc.data().subjects;
                students.push(doc.id);
                for (const key in subjects) {
                    subjects[key]['status'] = false;
                }
                await doc.ref.update({
                    subjects: subjects
                });
            });
        }
        resolve({ now: now, classIds, students })
        //   res.status(201).send({ now: now, classIds, students });

        // } catch (error: any) {
        //     res.status(error.code || 400).send(error);

        // }

    });
}

function getSHA512Hash(hashData: string) {

    var hash = crypto.createHash('sha512');
    var data = hash.update(hashData, 'utf-8');
    return data.digest('hex');
}

function getHmacSHA1Hash(hashData: string, salt: string) {
    return crypto.createHmac('sha1', salt).update(hashData).digest('hex');

}

function getHmacSHA256Hash(hashData: string, salt: string) {

    return crypto.createHmac('sha256', salt).update(hashData).digest('base64');
}


