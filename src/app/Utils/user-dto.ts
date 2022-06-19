import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { User } from "../Models/user";

export const mapUserDto = (firebaseUser: firebaseUser): User => {
  const user = new User();
  user.id = firebaseUser.uid;
  user.displayName = firebaseUser.displayName;
  return user;
}


export const mapUserToEmailSignIn = (user: User): User => {
  console.log(user);
  const newUser = new User();
  newUser.email = `${user.displayName}@example.com`
  newUser.password = user.password
  console.log(newUser);
  return newUser;
}
