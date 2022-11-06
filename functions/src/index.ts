// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// create a firebase function that inserts a user into firestore when they are created
export const createUser = functions.auth.user().onCreate((user: any) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

// create a firebase function that deletes a user from firestore when they are deleted
export const deleteUser = functions.auth.user().onDelete((user: any) => {
  return admin.firestore().collection('users').doc(user.uid).delete();
});

// create a firebase function that is triggered when a user is updated
export const updateUser = functions.firestore.document('users/{userId}').onUpdate((change: any, context: any) => {
  const data = change.after.data();
  const previousData = change.before.data();

  // check to see if the user's display name has changed
  if (data.displayName !== previousData.displayName) {
    // update the display name for the user's auth record
    return admin.auth().updateUser(context.params.userId, { displayName: data.displayName });
  }
  return null;
});
