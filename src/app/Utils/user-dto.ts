import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { User } from "../Models/user";

export const mapUserDto = (firebaseUser: firebaseUser): User => {
  const user: User = {
    displayName: firebaseUser.displayName,
    id: firebaseUser.uid,
  };
  return user;
}

export const mapUserToEmailSignIn = (user: User): User => {
  return {
    email: `${user.displayName}@example.com`,
    password: user.password
  };
}
