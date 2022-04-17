import firebase from "firebase/compat";
import firebaseUser = firebase.User;
import { User } from "../Models/user";

export const mapUserDto = (firebaseUser: firebaseUser): User => {
  const user = new User();
  user.id = firebaseUser.uid;
  user.displayName = firebaseUser.displayName;
  return user;
}
