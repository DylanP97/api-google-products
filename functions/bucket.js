const admin = require("firebase-admin");
const serviceAccount = require("./api--products-2-firebase-adminsdk-d8fle-8e106bd98a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://api--products-2.appspot.com",
});
const bucket = admin.storage().bucket();


module.exports = bucket;