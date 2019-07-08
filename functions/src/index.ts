import * as functions from 'firebase-functions';
import * as requestPromise from 'request-promise';
import * as admin from 'firebase-admin';

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sportsradar-1309b.firebaseio.com"
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((req, response) => {
 response.send("Hello from Firebase!");
});


// Fetch Data From Sports Radar. & Push Data into Firebase Realtime.
export const fetchSportsRadar = functions.https.onRequest((req, res) => {
    const options = {
        uri: "http://dipsgoswami.in/json/text.json"
    };
    requestPromise.get(options)
    .then(function (body: any) {
       // res.send(body);
        // Save Sports Details into Firebase Realtime Database.
        admin.database().ref('/sports/NBA').push(body)
        .then(() => {
             res.status(200).send(body)
        }).catch(error => {
            console.error(error);
             res.status(500).send('Oh no! Error: ' + error);
        });
    })
    .catch(function (err: any) {
        res.send(err);
    });
})

// Get Data From Firebase Realtime Database For Summery Function. & Push Data into Firestore.
export const getSportsData = functions.https.onRequest((req, res,) => {
     admin.database().ref('/sports/NBA').on("value", (snapshot:any) => {
        //  console.log(snapshot.val());
        // return res.status(200).send(snapshot.val());



        /*
         Summery Cloud Function 
        */



        // Save Sports Details into Firebase FireStore Database.
        admin.firestore().doc('sports/NBA').set(snapshot.val())
        .then(function() {
            res.send("Document successfully written!");
        })
        .catch(function(error) {
            res.send("Error writing document: "+ error);
        });

    }, (error: string) => {
        console.error(error);
         res.status(500).send('Oh no! Error: ' + error);
    });
})

// Push the Sorted Data into Firebase FireStore.
export const pushSportsData = functions.https.onRequest((req, res,) => {
    admin.firestore().doc('sports/NBA').set({
        name: "Los Angeles",
        state: "CA",
        country: "USA"
    })
    .then(function() {
        res.send("Document successfully written!");
    })
    .catch(function(error) {
        res.send("Error writing document: "+ error);
    });
})

// Get Record From FireStore 
export const getSportsDataFireStore = functions.https.onRequest((req, res,) => {
    admin.firestore().doc('students/etrupja').get()
    .then(snapshot => {
        res.send(snapshot.data());
    })
    .catch(error => {
        res.status(500).send("Something went wrong!");
    })
})