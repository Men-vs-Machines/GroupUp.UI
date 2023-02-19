const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
  functions.logger.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
};

app.use(cors);
// app.use(cookieParser);
// app.use(validateFirebaseIdToken);

app.get("/groups", async (req, res) => {
  const snapshot = await admin.firestore().collection("groups").get();

  if (snapshot == null) {
    res.status(204).send();
  }

  let groups = [];
  snapshot.forEach((snap) => {
    const id = snap.id;
    const data = snap.data();
    groups.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(groups));
});

exports.api = functions.https.onRequest(app);

module.exports.deleteUser = functions.auth.user().onDelete((user) => {
  return admin.firestore().collection("users").doc(user.uid).delete();
});

app.get("/groups/:id", async (req, res) => {
  const result = await admin
    .firestore()
    .collection("groups")
    .doc(req.params.id)
    .get();

  if (result == null) {
    res.status(204).send();
  }

  res.status(200).send(JSON.stringify(result.data()));
});

app.put("/groups", async (req, res) => {
  const group = req.body;

  const result = await admin
    .firestore()
    .collection("groups")
    .doc(group.id)
    .set(group, { merge: true });

  res.status(200).send();
});

app.post("/groups", async (req, res) => {
  const group = req.body;

  const groupRef = await admin.firestore().collection("groups").add(group);
  await groupRef.set({ id: groupRef.id }, { merge: true });

  res.status(200).send(groupRef);
});
