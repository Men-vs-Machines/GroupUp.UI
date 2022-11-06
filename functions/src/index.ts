// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

export const addUser = functions.auth.user().onCreate((user: any) => {
  console.log('User created', user);
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});