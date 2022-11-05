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
  console.log(user);
  const newUser: User = {
    email: `${user.displayName}@example.com`,
    password: user.password
  };
  console.log(newUser);
  return newUser;
}
